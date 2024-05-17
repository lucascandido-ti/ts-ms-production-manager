import {
  IsArray,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IOrder } from '../interfaces';
import { AcceptedCurrencies, OrderStatus } from '../enums';

import { Product } from '@/core/domain/product';
import { Customer } from '@/core/domain/customer';
import { PaymentMethod } from '../../utils';

export class Order implements IOrder {
  @IsString()
  @IsNotEmpty()
  Id: number;

  @IsNumber()
  @IsNotEmpty()
  Price: number;

  @IsEnum(AcceptedCurrencies)
  @IsNotEmpty()
  Currency: AcceptedCurrencies;

  @IsNumber()
  @IsNotEmpty()
  Invoice: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  Status: OrderStatus;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  PaymentMethod: PaymentMethod;

  @IsInstance(Customer)
  @ValidateNested()
  Customer: Customer;

  @IsArray({ each: true })
  Products: Product[];
}
