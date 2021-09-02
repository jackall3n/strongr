import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get('me')
  async me(@Headers('X-User-ID') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('X-User-ID is required');
    }

    const user = await this.user.findById(userId);

    return {
      id: user.objectId,
      username: user.username,
      name: user.name,
      email: user.email,
      goals: JSON.parse(user.goals),
    };
  }
}
