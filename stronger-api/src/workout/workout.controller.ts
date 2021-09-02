import { Controller, Get, Query } from '@nestjs/common';
import { sumBy } from 'lodash';
import { WorkoutService } from './workout.service';

export enum BodyParts {
  CORE = 1,
  ARMS = 2,
  BACK = 4,
  CHEST = 8,
  LEGS = 16,
  SHOULDERS = 32,
  OTHER = 64,
  OLYMPIC = 128,
  FULL_BODY = 256,
  CARDIO = 512,
}

export enum ExerciseType {
  BARBELL = 0,
  DUMBBELL = 1,
  MACHINE = 2,
  WEIGHTED_BODYWEIGHT = 3,
  ASSISTED_BODYWEIGHT = 4,
  REPS = 5,
  CARDIO = 6,
  DURATION = 7,
}

function getExerciseType(value: number): ExerciseType {
  const [key] = Object.entries(ExerciseType).find(([, v]) => v === value) ?? [];

  return key as any;
}

function getBodyParts(value: number): BodyParts {
  const [key] = Object.entries(BodyParts).find(([, v]) => v === value) ?? [];

  return key as any;
}

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workout: WorkoutService) {}

  @Get()
  async workouts(@Query('after') after: string) {
    console.log({ after });

    // const exercises = await this.workout.exercises();
    const { results, count } = await this.workout.findMany({ after });

    const workouts = results.map((workout) => {
      const exercises = workout.parseSetGroups.map((group) => {
        const exercise = group.parseExercise;
        const sets = group.parseSetsDictionary
          .filter((s) => s.isChecked)
          .map((set) => {
            // If exercise type is dumbbell, double the total
            const multiplier = set.exerciseTypeValue === 1 ? 2 : 1;

            const exerciseType = getExerciseType(set.exerciseTypeValue);

            // TODO: Workout a way of getting Apple HealthKit Measurements
            // If exercise type is body weight, add body weight
            const extra = set.exerciseTypeValue === 3 ? 75 : 0;

            const total = (extra + set.kilograms) * set.reps * multiplier ?? 0;

            return {
              kilograms: set.kilograms,
              exerciseType,
              reps: set.reps,
              expectedReps: set.expectedReps,
              personalRecords: set.personalRecords?.split(',') ?? [],
              total,
            };
          });

        const total = sumBy(sets, 'total');
        const prs = sumBy(sets, (s) => s.personalRecords.length);

        return {
          id: exercise.objectId,
          uid: exercise.uniqueId,
          name: exercise.name,
          type: exercise.exerciseType,
          bodyParts: exercise.bodyParts,
          prs,
          sets,
          total,
        };
      });

      const total = sumBy(exercises, 'total');
      const prs = sumBy(exercises, 'prs');

      return {
        id: workout.objectId,
        name: workout.name,
        startDate: workout.startDate?.iso,
        completionDate: workout.completionDate?.iso,
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
        prs,
        exercises,
        total,
      };
    });

    return {
      // exercises: exercises.map((exercise) => {
      //   const type = getExerciseType(exercise.exerciseType);
      //   const bodyParts = getBodyParts(exercise.bodyParts);
      //
      //   return {
      //     id: exercise.objectId,
      //     uid: exercise.uniqueId,
      //     build: exercise.build,
      //     name: exercise.name,
      //     isGlobal: exercise.isGlobal,
      //     type,
      //     bodyParts,
      //   };
      // }),
      results: workouts,
      count,
    };
  }
}
