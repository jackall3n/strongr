import { Global, HttpModule, Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const session = configService.get('PARSE_SESSION');
        const applicationId = configService.get('PARSE_APPLICATION_ID');

        return {
          baseURL: 'https://strong4-server.herokuapp.com/parse',
          headers: {
            'X-Parse-Session-Token': session,
            'X-Parse-Application-Id': applicationId,
          },
        };
      },
    }),
  ],
  providers: [ParseService],
  exports: [ParseService],
})
export class ParseModule {}
