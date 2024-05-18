import { RabbitMQRepository } from '@/adapters/rabbitMQ/rabbitmq.repository';
import { PrismaService } from '@/config';
import { QUEUE_REPOSITORY } from '@/config/dependecy-injection';
import { ProductionStatus } from '@/core/domain/production';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductionWorkflowWorker implements OnModuleInit {
  private readonly logger = new Logger(ProductionWorkflowWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(QUEUE_REPOSITORY)
    private readonly rabbitMQRepository: RabbitMQRepository,
  ) {}

  onModuleInit() {
    this.logger.log(
      `Creating CRON ${ProductionWorkflowWorker.name}: (*/2 * * * *)`,
    );
  }

  @Cron('*/2 * * * *')
  async handleCron() {
    try {
      this.logger.debug(`Started CRON ${ProductionWorkflowWorker.name}`);
      const productionsInPreparation = await this.prisma.production.findMany({
        where: { status: ProductionStatus.IN_PREPARATION },
      });

      if (productionsInPreparation.length) {
        for await (const production of productionsInPreparation) {
          const updatedProdution = await this.prisma.production.update({
            data: {
              status: ProductionStatus.CONCLUDED,
            },
            where: { id: production.id },
          });

          const fullProduction = await this.prisma.production.findUnique({
            where: { id: updatedProdution.id },
            include: { order: true },
          });

          this.rabbitMQRepository.publish(
            fullProduction,
            'concluded-production',
          );
        }
      }

      const productions = await this.prisma.production.findMany({
        where: { status: ProductionStatus.RECEIVED },
      });

      if (!productions) return;

      for await (const production of productions) {
        const updatedProdution = await this.prisma.production.update({
          data: {
            status: ProductionStatus.IN_PREPARATION,
          },
          where: { id: production.id },
        });

        const fullProduction = await this.prisma.production.findUnique({
          where: { id: updatedProdution.id },
          include: { order: true },
        });

        this.rabbitMQRepository.publish(fullProduction, 'start-production');
      }

      this.logger.debug(`Finished CRON ${ProductionWorkflowWorker.name}`);
    } catch (error) {
      this.logger.debug(
        `Failed CRON ${ProductionWorkflowWorker.name} Error: ${error.message}`,
      );
    } finally {
      this.logger.debug(`Finished CRON ${ProductionWorkflowWorker.name}`);
    }
  }
}
