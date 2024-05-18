import { PrismaService } from '@/config';
import { Order, orderStatusNumber } from '@/core/domain/order';

import {
  IProductionRepository,
  ProductionStatus,
} from '@/core/domain/production';
import {
  acceptedCurrenciesNumber,
  paymentMethodNumber,
} from '@/core/domain/utils';
import { Injectable } from '@nestjs/common';
import {
  Customer,
  Product,
  Production,
  Order as OrderModel,
} from '@prisma/client';

@Injectable()
export class ProductionRepository implements IProductionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async CreateProduction(order: Order): Promise<Production> {
    const findOrder = await this.findOrder(order);

    const production = await this.prisma.production.create({
      data: {
        status: ProductionStatus.RECEIVED,
        orderId: findOrder.id,
      },
    });

    return production;
  }

  async findOrder({
    Customer,
    Products,
    ...payload
  }: Order): Promise<OrderModel> {
    const customer = await this.findCustomer(Customer);
    const products = await this.findProducts(Products);

    try {
      const findOrder = await this.prisma.order.findFirst({
        where: { orderId: payload.Id },
      });
      if (!findOrder) throw new Error('Order not found');

      return findOrder;
    } catch (error) {
      const findOrder = await this.prisma.order.create({
        data: {
          Invoice: payload.Invoice,
          Status: orderStatusNumber[payload.Status],
          PaymentMethod: paymentMethodNumber[payload.PaymentMethod],
          Price: payload.Price,
          Currency: acceptedCurrenciesNumber[payload.Currency],
          orderId: payload.Id,
          customerId: customer.id,
        },
      });

      for await (const product of products) {
        await this.prisma.productsOrders.create({
          data: {
            orderId: findOrder.id,
            productId: product.id,
          },
        });
      }

      return findOrder;
    }
  }

  async findCustomer(dto: Customer): Promise<Customer> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: { Email: dto.Email },
      });
      if (!customer) throw new Error('Customer not found');

      return customer;
    } catch (e) {
      const customer = await this.prisma.customer.create({
        data: {
          Name: dto.Name,
          Email: dto.Email,
          Cpf: dto.Cpf,
        },
      });
      return customer;
    }
  }

  async findProducts(products: Product[]): Promise<Product[]> {
    const payloadProducts: Product[] = [];

    for await (const product of products) {
      try {
        const prod = await this.prisma.product.findFirst({
          where: { Name: product.Name, Description: product.Description },
        });

        if (!prod) throw new Error('Product not found');

        payloadProducts.push(prod);
      } catch (err) {
        const prod = await this.prisma.product.create({
          data: {
            Name: product.Name,
            Description: product.Description,
            Price: product.Price,
            Currency: acceptedCurrenciesNumber[product.Currency],
          },
        });

        payloadProducts.push(prod);
      }
    }

    return payloadProducts;
  }
}
