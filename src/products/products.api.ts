import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductsAPI {
  private url = 'http://localhost:3000';

  setUrl(url: string) {
    this.url = url;
  }

  async getAll() {
    return axios.get(`${this.url}/products`);
  }

  async getById(id) {
    return axios.get(`${this.url}/products/${id}`);
  }
}
