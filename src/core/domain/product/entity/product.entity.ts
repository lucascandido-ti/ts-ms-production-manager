import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IProduct } from '../interfaces';
import { AcceptedCurrencies } from '../../order';

export class Product implements IProduct {
  @IsNumber()
  @IsNotEmpty()
  Id: number;

  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsString()
  @IsNotEmpty()
  Description: string;

  @IsNumber()
  @IsNotEmpty()
  Price: number;

  @IsEnum(AcceptedCurrencies)
  @IsNotEmpty()
  Currency: AcceptedCurrencies;
}
