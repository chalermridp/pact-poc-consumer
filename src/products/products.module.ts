import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductsAPI } from './products.api';

@Module({
  imports: [ConfigModule],
  providers: [ProductsService, ProductsAPI],
  controllers: [ProductsController],
})
export class ProductsModule {}
