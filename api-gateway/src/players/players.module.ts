import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlayersController } from './players.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PLAYER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@172.23.91.243:5672/smartranking'],
          queue: 'smartranking_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PlayersController],
})
export class PlayersModule {}
