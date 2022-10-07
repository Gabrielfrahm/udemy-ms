import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChallengerController } from './challenger.controller';

const configService = new ConfigService();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATEGORY',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@172.19.183.176:5672/smartranking`],
          queue: 'smartranking_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PLAYER',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@172.19.183.176:5672/smartranking`],
          queue: 'smartranking_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'CHALLENGER',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@172.19.183.176:5672/smartranking`],
          queue: 'challenger_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ChallengerController],
})
export class ChallengerModule {}
