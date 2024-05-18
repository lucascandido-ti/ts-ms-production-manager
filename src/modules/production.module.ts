import { CqrsModule } from '@nestjs/cqrs';
import { Module, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PrismaService } from '@/config';
import {
  PRODUCTION_REPOSITORY,
  PRODUCTION_SERVICE,
} from '@/config/dependecy-injection';

import { ProductionController } from '@/consumers';
import { ProductionRepository } from '@/adapters/data';
import { CreateProductionCommandHandler } from '@/core/application/production/commands';
import { ProductionWorkflowWorker } from '@/core/application/production/workers';

const httpControllers = [ProductionController];
const handlers: Provider[] = [CreateProductionCommandHandler];
const services: Provider[] = [PrismaService];
const workers: Provider[] = [ProductionWorkflowWorker];
const repositories: Provider[] = [
  { provide: PRODUCTION_REPOSITORY, useClass: ProductionRepository },
];

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTION_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'production-service-queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [...handlers, ...repositories, ...services, ...workers],
})
export class ProductionModule {}
