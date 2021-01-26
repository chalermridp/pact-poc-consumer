import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { ProductsModel } from './products.model';

@Injectable()
export class ProductsService {
  getAll(): ProductsModel[] {
    return null;
  }

  getById(id: string): ProductsModel {
    return null;
  }
}
