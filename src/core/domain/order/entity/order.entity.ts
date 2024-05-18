import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AcceptedCurrencies, OrderStatus } from '../enums';

import { PaymentMethod } from '../../utils';
import { Customer, Product } from '@prisma/client';

export class Order {
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

  @ValidateNested()
  Customer: Customer;

  @IsArray({ each: true })
  Products: Product[];
}
