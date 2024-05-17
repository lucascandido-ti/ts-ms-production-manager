import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ICustomer } from '../interfaces';

export class Customer implements ICustomer {
  @IsNumber()
  @IsNotEmpty()
  Id: number;

  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsString()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @IsNotEmpty()
  Cpf: string;
}
