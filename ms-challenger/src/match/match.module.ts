import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { matchSchema } from './interfaces/match.schema';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
const configService = new ConfigService();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: matchSchema }]),
    ClientsModule.register([
      {
        name: 'CHALLENGER',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${configService.get<string>(
              'RABIITMQ_USER',
            )}:${configService.get<string>(
              'RABIITMQ_PASSWORD',
            )}@${'RABIITMQ_URL'}`,
          ],
          queue: 'challenger_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
