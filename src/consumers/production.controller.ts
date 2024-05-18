import { CreateProductionCommand } from '@/core/application/production/commands';
import { Order } from '@/core/domain/order';
import { IQueueData } from '@/core/domain/queue';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';

@Controller('production')
export class ProductionController {
  private readonly logger = new Logger(ProductionController.name);

  constructor(private commandBus: CommandBus) {}

  @EventPattern('send-order-to-production')
  async getOrderEvent(@Ctx() context: RmqContext): Promise<void> {
    const getMessage = context.getMessage();
    const message = Buffer.from(getMessage.content);
    const { data } = JSON.parse(message.toString()) as IQueueData<Order>;

    this.logger.debug(`Received Event: ${JSON.stringify(data)}`);

    await this.commandBus.execute(new CreateProductionCommand({ order: data }));
  }
}
