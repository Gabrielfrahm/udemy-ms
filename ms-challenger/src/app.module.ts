import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ChallengerModule } from './challenger/challenger.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/admin_back'),
    ChallengerModule,
    MatchModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
