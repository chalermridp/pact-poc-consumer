import { ProductsModel } from '../products.model';

export class ProductsResponse {
  products: ProductsModel[];

  constructor(products: ProductsModel[]) {
    this.products = products;
  }
}
