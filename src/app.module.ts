import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { ProductionModule } from '@/modules';
import { cacheModuleOptions, configModuleOptions } from '@/config';

@Module({
  imports: [
    CacheModule.register(cacheModuleOptions),
    ConfigModule.forRoot(configModuleOptions),
    ProductionModule,
  ],
})
export class AppModule {}
