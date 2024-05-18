import { CreateProductionRequest } from '../requests';

export class CreateProductionCommand {
  constructor(public readonly request: CreateProductionRequest) {}
}
