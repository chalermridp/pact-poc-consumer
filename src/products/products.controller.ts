import { Controller, Get, Param } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.reponse';
import { ProductsService } from './products.service';
import { ProductResponse } from './responses/product.response';
import { ProductsResponse } from './responses/products.response';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getAllProducts(): BaseResponse<ProductsResponse> {
    return new BaseResponse(
      200,
      new ProductsResponse(this.productsService.getAll()),
    );
  }

  @Get('/:id')
  getById(@Param('id') id: string): BaseResponse<ProductResponse> {
    return new BaseResponse(
      200,
      new ProductResponse(this.productsService.getById(id)),
    );
  }
}
