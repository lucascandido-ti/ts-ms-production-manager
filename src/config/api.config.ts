import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ThrottlerAsyncOptions } from '@nestjs/throttler';

import {
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsPort,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RabbitMQConfig } from './rabbitmq.config';

export class ApiCacheConfig implements CacheModuleOptions {
  @IsNumber()
  @IsPositive()
  max: number;

  @IsNumber()
  @IsPositive()
  ttl: number;
}

export const cacheModuleOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const cacheConfig = configService.get<CacheModuleOptions>('api.cache')!;

    return { isGlobal: true, ...cacheConfig };
  },
};

export class ApiThrottlerConfig {
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsNumber()
  @IsPositive()
  ttl: number;
}

export const throttlerModuleOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    configService.get('api.throttler')!,
};

export class ApiConfig {
  @IsPort()
  @IsString()
  port: string;

  @IsNotEmpty()
  @IsString()
  prefix: string;

  @IsInstance(ApiCacheConfig)
  @ValidateNested()
  cache: ApiCacheConfig;

  @IsInstance(ApiThrottlerConfig)
  @ValidateNested()
  throttler: ApiThrottlerConfig;

  @IsInstance(RabbitMQConfig)
  @ValidateNested()
  rabbitmq: RabbitMQConfig;
}
