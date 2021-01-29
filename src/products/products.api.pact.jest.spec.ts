import { pactWith } from 'jest-pact';
import { Test } from '@nestjs/testing/test';
import { ProductsAPI } from './products.api';
import { ProductsModule } from './products.module';
import { like } from '@pact-foundation/pact/dsl/matchers';

pactWith(
  { consumer: 'PactPocConsumer', provider: 'PactPocProvider' },
  (provider) => {
    const allProductsResponse = {
      code: 200,
      data: {
        products: [
          {
            id: '1',
            sku: '111',
            name_en: 'water',
            price: 30,
            is_active: true,
          },
          {
            id: '2',
            sku: '222',
            name_en: 'shoes',
            price: 40,
            is_active: false,
          },
        ],
      },
    };

    const productResponse = {
      code: 200,
      data: {
        product: {
          id: '1',
          sku: '111',
          name_en: 'water',
          price: 30,
          is_active: true,
        },
      },
    };

    const productNotFoundErrorResponse = {
      code: 404,
      error_name: 'not_found',
      error_message: 'product not found',
    };

    let productsApi;
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [ProductsModule],
      }).compile();

      productsApi = moduleRef.get(ProductsAPI);
      // productsApi.setUrl(provider.mockService.baseUrl);
      productsApi.setUrl('http://localhost:3000');
    });

    describe('get all products', () => {
      // beforeAll(() => {
      //   provider.addInteraction({
      //     state: 'products exist',
      //     uponReceiving: 'get all products',
      //     withRequest: {
      //       method: 'GET',
      //       path: '/products',
      //     },
      //     willRespondWith: {
      //       status: 200,
      //       headers: {
      //         'Content-Type': 'application/json; charset=utf-8',
      //       },
      //       body: like(allProductsResponse),
      //     },
      //   });
      // });

      it('return all products', (done) => {
        productsApi.getAll().then((response) => {
          expect(response.status).toBe(200);
          expect(response.data).toEqual(allProductsResponse);
          done();
        }, done);
      });
    });

    describe('get product by id', () => {
      describe('product exists', () => {
        // beforeAll(() => {
        //   provider.addInteraction({
        //     state: 'products id 1 exists',
        //     uponReceiving: 'get product with id 1',
        //     withRequest: {
        //       method: 'GET',
        //       path: '/products/1',
        //     },
        //     willRespondWith: {
        //       status: 200,
        //       headers: {
        //         'Content-Type': 'application/json; charset=utf-8',
        //       },
        //       body: like(productResponse),
        //     },
        //   });
        // });

        it('return product id 1', (done) => {
          productsApi.getById(1).then((response) => {
            expect(response.status).toBe(200);
            expect(response.data).toEqual(productResponse);
            done();
          }, done);
        });
      });

      describe('product does not exists', () => {
        // beforeAll(() => {
        //   provider.addInteraction({
        //     state: 'products id 3 does not exist',
        //     uponReceiving: 'get error product not found',
        //     withRequest: {
        //       method: 'GET',
        //       path: '/products/3',
        //     },
        //     willRespondWith: {
        //       status: 404,
        //       headers: {
        //         'Content-Type': 'application/json; charset=utf-8',
        //       },
        //       body: like(productNotFoundErrorResponse),
        //     },
        //   });
        // });

        it('return not found error', (done) => {
          try {
            expect(productsApi.getById(3)).rejects.toThrow(
              'Request failed with status code 404',
            );
          } finally {
            done();
          }
        });
      });
    });
  },
);
