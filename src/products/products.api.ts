import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductsAPI {
  private url: string;

  constructor(private configService: ConfigService) {
    this.url = configService.get('apiUrl');
  }

  async getAll() {
    return await axios
      .get(`${this.url}/products`)
      .then((response) => response.data.data.products);
  }

  async getById(id) {
    return await axios
      .get(`${this.url}/products/${id}`)
      .then((response) => response.data.data.product);
  }
}
