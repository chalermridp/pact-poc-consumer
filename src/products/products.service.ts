import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BaseException } from 'src/common/exceptions/base.exception';
import { ProductsModel } from './products.model';

@Injectable()
export class ProductsService {
  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('apiUrl');
  }

  private apiUrl: string;

  async getAll(): Promise<ProductsModel[]> {
    const response = await axios.get(`${this.apiUrl}/products`);
    return response.data.data.products;
  }

  async getById(id: string): Promise<ProductsModel> {
    try {
      const response = await axios.get(`${this.apiUrl}/products/${id}`);
      return response.data;
    } catch (error) {
      throw new BaseException(
        error.response.data.code,
        error.response.data.error_name,
        error.response.data.error_message,
      );
    }
  }
}
