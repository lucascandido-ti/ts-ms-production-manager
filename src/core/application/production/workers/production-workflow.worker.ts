import { PrismaService } from '@/config';
import { ProductionStatus } from '@/core/domain/production';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductionWorkflowWorker implements OnModuleInit {
  private readonly logger = new Logger(ProductionWorkflowWorker.name);

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.logger.log(
      `Creating CRON ${ProductionWorkflowWorker.name}: (*/2 * * * *)`,
    );
  }

  @Cron('*/2 * * * *')
  async handleCron() {
    try {
      this.logger.debug(`CRON ${ProductionWorkflowWorker.name} started...`);
      const productionsInPreparation = await this.prisma.production.findMany({
        where: { status: ProductionStatus.IN_PREPARATION },
      });

      if (productionsInPreparation.length) {
        for await (const production of productionsInPreparation) {
          await this.prisma.production.update({
            data: {
              status: ProductionStatus.CONCLUDED,
            },
            where: { id: production.id },
          });
        }
      }

      const productions = await this.prisma.production.findMany({
        where: { status: ProductionStatus.RECEIVED },
      });

      if (!productions) return;

      for await (const production of productions) {
        await this.prisma.production.update({
          data: {
            status: ProductionStatus.IN_PREPARATION,
          },
          where: { id: production.id },
        });
      }
      this.logger.debug(`CRON ${ProductionWorkflowWorker.name} finished...`);
    } catch (error) {
      this.logger.debug(
        `CRON ${ProductionWorkflowWorker.name} Error: ${error.message}`,
      );
    } finally {
      this.logger.debug(`CRON ${ProductionWorkflowWorker.name} finished...`);
    }
  }
}
