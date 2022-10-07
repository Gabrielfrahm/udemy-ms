import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengerController } from './challenger.controller';
import { ChallengerService } from './challenger.service';
import { ChallengerSchema } from './interfaces/challenger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenger', schema: ChallengerSchema },
    ]),
  ],

  controllers: [ChallengerController],
  providers: [ChallengerService],
})
export class ChallengerModule {}
