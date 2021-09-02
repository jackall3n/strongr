import { Injectable } from '@nestjs/common';
import { ParseService } from '../parse/parse.service';

@Injectable()
export class UserService {
  constructor(private parse: ParseService) {}

  async findById(id: string) {
    return await this.parse.user(id);
  }
}
