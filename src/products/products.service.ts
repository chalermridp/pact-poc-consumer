import { Injectable } from '@nestjs/common';
import { BaseException } from '../common/exceptions/base.exception';
import { ProductsAPI } from './products.api';
import { ProductsModel } from './products.model';

@Injectable()
export class ProductsService {
  constructor(private productsApi: ProductsAPI) {}

  async getAll(): Promise<ProductsModel[]> {
    return await this.productsApi.getAll();
  }

  async getById(id: string): Promise<ProductsModel> {
    try {
      return await this.productsApi.getById(id);
    } catch (error) {
      console.log(error);
      throw new BaseException(
        error.response.data.code,
        error.response.data.error_name,
        error.response.data.error_message,
      );
    }
  }
}
