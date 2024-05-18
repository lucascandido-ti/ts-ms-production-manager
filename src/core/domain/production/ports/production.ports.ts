import { Production } from '@prisma/client';
import { Order } from '../../order';

export interface IProductionRepository {
  CreateProduction(order: Order): Promise<Production>;
}
