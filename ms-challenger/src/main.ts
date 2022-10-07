import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://guest:guest@172.19.183.176:5672/smartranking`],
      queue: 'challenger_queue',
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}
bootstrap();
