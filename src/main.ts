import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Config } from './config';

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

  const configService = app.get(ConfigService);
  const config = (configService as unknown as { internalConfig: Config })
    .internalConfig;

  const queues = ['order-service-queue.send-order-to-production'];

  const infoQueue: IQueueInfo = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
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

  app.setGlobalPrefix(config.api.prefix);
  await app.listen(+config.api.port);
}
bootstrap();
