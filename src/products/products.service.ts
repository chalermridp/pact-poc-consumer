import { Injectable } from '@nestjs/common';
import { BaseException } from '../common/exceptions/base.exception';
import { ProductsAPI } from './products.api';
import { ProductsModel } from './products.model';

@Injectable()
export class ProductsService {
  constructor(private productsApi: ProductsAPI) { }

  async getAll(): Promise<ProductsModel[]> {
    const response = await this.productsApi.getAll();
    return response.data.data.products;
  }

  async getById(id: string): Promise<ProductsModel> {
    try {
      const response = await this.productsApi.getById(id);
      return response.data.data.product;
    } catch (error) {
      throw new BaseException(
        error.response.data.data.code,
        error.response.data.data.error_name,
        error.response.data.data.error_message,
      );
    }
  }
}
