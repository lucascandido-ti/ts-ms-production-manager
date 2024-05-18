import { ProductionStatus } from '@/core/domain/production';
import { Production } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ProductionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ProductionStatus)
  @IsNotEmpty()
  status: ProductionStatus;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  public MapToModel(dto: ProductionDto): Production {
    const { id, status, orderId } = dto;
    return {
      id,
      status,
      orderId: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Production;
  }

  public MapToDTO(model: Production): ProductionDto {
    const { id, status, orderId } = model;
    return {
      id,
      status,
      orderId,
    } as ProductionDto;
  }
}
