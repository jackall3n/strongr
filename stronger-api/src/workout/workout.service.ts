import { Injectable } from '@nestjs/common';
import { ParseService } from '../parse/parse.service';

@Injectable()
export class WorkoutService {
  userId = 'HlvTjDDwoy';

  constructor(private parse: ParseService) {}

  async findMany(options: { after?: string }) {
    const user = await this.parse.workouts(this.userId, options);

    return user;
  }

  async user() {
    const user = await this.parse.user(this.userId);

    return user;
  }

  async measurements() {
    const measurements = await this.parse.measurements(this.userId);

    return measurements;
  }

  async exercises() {
    const global = await this.parse.exercises();
    const users = await this.parse.exercises(this.userId);

    return [...global.results, ...users.results];
  }
}
