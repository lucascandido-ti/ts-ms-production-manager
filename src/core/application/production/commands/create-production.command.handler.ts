import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IProductionRepository } from '@/core/domain/production';
import { PRODUCTION_REPOSITORY } from '@/config/dependecy-injection';

import { ProductionDto } from '../dto';
import { ProductionResponse } from '../responses';
import { CreateProductionCommand } from './create-production.command';

@CommandHandler(CreateProductionCommand)
export class CreateProductionCommandHandler
  implements ICommandHandler<CreateProductionCommand>
{
  private readonly logger = new Logger(CreateProductionCommandHandler.name);

  constructor(
    @Inject(PRODUCTION_REPOSITORY)
    private readonly _productionRepository: IProductionRepository,
  ) {}

  async execute({ request }: CreateProductionCommand) {
    const production = await this._productionRepository.CreateProduction(
      request.order,
    );

    const productionDto = new ProductionDto().MapToDTO(production);

    const response = new ProductionResponse(productionDto);
    response.Success = true;

    return response;
  }
}
