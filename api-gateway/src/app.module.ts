import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengerModule } from './challenger/challenger.module';

@Module({
  imports: [
    CategoriesModule,
    PlayersModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChallengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
