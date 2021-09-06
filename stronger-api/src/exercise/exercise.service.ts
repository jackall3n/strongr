import { Injectable } from '@nestjs/common';
import { ParseService } from '../parse/parse.service';

@Injectable()
export class ExerciseService {
  constructor(private parse: ParseService) {}

  async exercises(id: string) {
    const global = await this.parse.exercises();
    const users = await this.parse.exercises(id);

    return [...global.results, ...users.results];
  }
}
