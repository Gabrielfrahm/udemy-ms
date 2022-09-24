import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATEGORY',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@172.21.171.82:5672/smartranking'],
          queue: 'smartranking_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
