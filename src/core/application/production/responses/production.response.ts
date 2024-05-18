import { Response } from '@/core/domain/utils';
import { ProductionDto } from '../dto';

export class ProductionResponse extends Response {
  public Data: ProductionDto;
  constructor(Data: ProductionDto) {
    super();
    this.Data = Data;
  }
}
