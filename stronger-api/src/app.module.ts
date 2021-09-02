import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ParseModule } from './parse/parse.module';
import { WorkoutModule } from './workout/workout.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    ParseModule,
    WorkoutModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
