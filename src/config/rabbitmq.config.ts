import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProviderOptions,
  ClientsProviderAsyncOptions,
} from '@nestjs/microservices';
import { IsNotEmpty, IsString } from 'class-validator';

export const rabbitmqModuleOptions: ClientsProviderAsyncOptions = {
  name: 'PRODUCTION_SERVICE',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    configService.get<ClientProviderOptions>('api.rabbitmq')!,
};

export class QueueOptions {
  durable: boolean;
}

export class ExchangeOptions {
  name: string;
  type: string;
  echangeOpts: QueueOptions;
}

export class RabbitMQOptions {
  urls: string[];
  queue: string;
  queueOptions: QueueOptions;
  exchange: ExchangeOptions;
}

export class RabbitMQConfig {
  @IsString()
  @IsNotEmpty()
  name: string;
  options: RabbitMQOptions;
}
