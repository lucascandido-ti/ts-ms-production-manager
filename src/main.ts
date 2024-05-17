import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';

interface IQueueOptions {
  urls: string[];
  queue: string;
  queueOptions: {
    durable: boolean;
  };
}

interface IQueueInfo {
  transport: Transport;
  options: IQueueOptions;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const queues = [
    'order-service-queue',
    'payment-service-queue',
    'production-service-queue',
  ];

  const infoQueue: IQueueInfo = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queueOptions: {
        durable: true,
      },
    },
  } as IQueueInfo;

  for await (const queue of queues) {
    infoQueue.options.queue = queue;
    await app.connectMicroservice(infoQueue);
  }

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
