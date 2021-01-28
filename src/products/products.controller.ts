import { Controller, Get, Param } from '@nestjs/common';
import { BaseResponse } from '../common/responses/base.reponse';
import { ProductsService } from './products.service';
import { ProductResponse } from './responses/product.response';
import { ProductsResponse } from './responses/products.response';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<BaseResponse<ProductsResponse>> {
    return new BaseResponse(
      200,
      new ProductsResponse(await this.productsService.getAll()),
    );
  }

  @Get('/:id')
  async getById(
    @Param('id') id: string,
  ): Promise<BaseResponse<ProductResponse>> {
    return new BaseResponse(
      200,
      new ProductResponse(await this.productsService.getById(id)),
    );
  }
}
