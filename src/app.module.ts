import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { ProductionModule } from '@/modules';
import { cacheModuleOptions, configModuleOptions } from '@/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CacheModule.register(cacheModuleOptions),
    ConfigModule.forRoot(configModuleOptions),
    ScheduleModule.forRoot(),
    ProductionModule,
  ],
})
export class AppModule {}
