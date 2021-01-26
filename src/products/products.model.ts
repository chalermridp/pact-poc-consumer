export class ProductsModel {
  id: string;
  sku: string;
  name_en: string;
  price: number;
  is_active: boolean;

  constructor(
    id: string,
    sku: string,
    name_en: string,
    price: number,
    is_active: boolean,
  ) {
    this.id = id;
    this.sku = sku;
    this.name_en = name_en;
    this.price = price;
    this.is_active = is_active;
  }
}
