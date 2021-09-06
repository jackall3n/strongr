import { Injectable } from '@nestjs/common';
import { ParseService } from '../parse/parse.service';

@Injectable()
export class WorkoutService {
  constructor(private parse: ParseService) {}

  async findMany(
    userId: string,
    options: { after?: string; template?: boolean },
  ) {
    return await this.parse.workouts(userId, options);
  }
}
