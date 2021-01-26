import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
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
    const response = await axios.get(`${this.apiUrl}/products/${id}`);
    //todo handle product not found error
    return response.data;
  }
}
