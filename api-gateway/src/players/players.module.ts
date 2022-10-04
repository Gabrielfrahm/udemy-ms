import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AwsModule } from 'src/aws/aws.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PLAYER',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@172.17.192.147:5672/smartranking`],
          queue: 'smartranking_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AwsModule,
  ],
  controllers: [PlayersController],
})
export class PlayersModule {}
