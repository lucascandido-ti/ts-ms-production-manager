import { PaymentMethod } from '@/core/domain/utils';

import { IProduct } from '@/core/domain/product/interfaces/';
import { ICustomer } from '@/core/domain/customer/interfaces/';

import { AcceptedCurrencies, OrderStatus } from '../enums';

export interface IOrder {
  Id: number;
  Price: number;
  Currency: AcceptedCurrencies;
  Invoice: number;
  Status: OrderStatus;
  PaymentMethod: PaymentMethod;
  Customer: ICustomer;
  Products: IProduct[];
}
