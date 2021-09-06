import { Controller, Get, Headers, Query } from '@nestjs/common';
import { sumBy } from 'lodash';
import {
  ExerciseType,
  getBodyParts,
  getExerciseType,
} from 'src/utils/mapEnums';
import { WorkoutService } from './workout.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workout: WorkoutService) {}

  @Get()
  async workouts(
    @Headers('X-User-ID') userId: string,
    @Query('after') after: string,
  ) {
    console.log({ userId, after });

    const { results, count } = await this.workout.findMany(userId, { after });

    const workouts = results.map((workout) => {
      const exercises = workout.parseSetGroups
        .filter((g) => !g.isHidden)
        .map((group) => {
          const exercise = group.parseExercise;

          const sets = group.parseSetsDictionary.map((set) => {
            const {
              exerciseTypeValue,
              kilograms = 0,
              reps = 0,
              expectedReps,
              isChecked,
              personalRecords,
            } = set;

            const exerciseType = getExerciseType(exerciseTypeValue);

            const multiplier =
              exerciseTypeValue === ExerciseType.DUMBBELL ? 2 : 1;

            // TODO: Workout a way of getting Apple HealthKit Measurements
            // If exercise type is body weight, add body weight
            const extra = [
              ExerciseType.WEIGHTED_BODYWEIGHT,
              ExerciseType.ASSISTED_BODYWEIGHT,
            ].includes(exerciseTypeValue)
              ? 75
              : 0;

            const total = isChecked
              ? (extra + kilograms) * reps * multiplier ?? 0
              : 0;

            return {
              kilograms,
              exerciseType,
              reps,
              expectedReps,
              personalRecords: personalRecords?.split(',') ?? [],
              isChecked,
              total,
            };
          });

          const total = sumBy(sets, 'total');
          const prs = sumBy(sets, (s) => s.personalRecords.length);

          return {
            id: exercise.objectId,
            uid: exercise.uniqueId,
            name: exercise.name,
            type: getExerciseType(exercise.exerciseType),
            bodyParts: getBodyParts(exercise.bodyParts),
            prs,
            sets,
            total,
          };
        });

      const total = sumBy(exercises, 'total');
      const prs = sumBy(exercises, 'prs');

      const routine = workout.parseRoutine;
      const folder = routine?.parseFolder;

      return {
        id: workout.objectId,
        name: workout.name,
        startDate: workout.startDate?.iso,
        completionDate: workout.completionDate?.iso,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
        isTemplate: !!routine,
        index: routine?.index,
        folder: folder
          ? {
              id: folder.objectId,
              name: folder.name,
              index: folder.index,
            }
          : undefined,
        prs,
        exercises,
        total,
      };
    });

    return {
      results: workouts,
      count,
    };
  }
}
