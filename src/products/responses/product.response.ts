import { ProductsModel } from '../products.model';

export class ProductResponse {
  product: ProductsModel;

  constructor(product: ProductsModel) {
    this.product = product;
  }
}
