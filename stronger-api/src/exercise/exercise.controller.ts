import { Controller, Get, Headers, Query } from '@nestjs/common';
import { getBodyParts, getExerciseType } from 'src/utils/mapEnums';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exercise: ExerciseService) {}

  @Get()
  async exercises(
    @Headers('X-User-ID') userId: string,
    @Query('after') after: string,
  ) {
    console.log({ after });

    const exercises = await this.exercise.exercises(userId);

    return exercises.map((exercise) => {
      const type = getExerciseType(exercise.exerciseType);
      const bodyParts = getBodyParts(exercise.bodyParts);

      return {
        id: exercise.objectId,
        uid: exercise.uniqueId,
        build: exercise.build,
        name: exercise.name,
        isGlobal: exercise.isGlobal,
        type,
        bodyParts,
      };
    });
  }
}
