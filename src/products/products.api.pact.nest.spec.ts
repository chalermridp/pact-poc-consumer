import { Pact } from '@pact-foundation/pact';
import { Test } from '@nestjs/testing';
import { PactFactory } from 'nestjs-pact';
import { PactModule } from '../../test/pact/pact.module';
import { ProductsAPI } from './products.api';
import { ProductsModule } from './products.module';
import { like } from '@pact-foundation/pact/dsl/matchers';

describe('Pact', () => {
  let pactFactory: PactFactory;
  let provider: Pact;
  let productsApi: ProductsAPI;

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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PactModule, ProductsModule],
    }).compile();

    pactFactory = moduleRef.get(PactFactory);
    productsApi = moduleRef.get(ProductsAPI);

    provider = pactFactory.createContractBetween({
      consumer: 'PactPocConsumer',
      provider: 'PactPocProvider',
    });

    console.log('beforeAll 111');
    await provider.setup();
    console.log('beforeAll 222');
  });

  afterEach(() => provider.verify());

  afterAll(() => provider.finalize());

  describe('get all products', () => {
    beforeAll(async () => {
      console.log('beforeAll get all products 333');
      await provider.addInteraction({
        state: 'products exist',
        uponReceiving: 'get all products',
        withRequest: {
          method: 'GET',
          path: '/products',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like(allProductsResponse),
        },
      });
      console.log('beforeAll get all products 444');
    });

    it('return all products', (done) => {
      console.log('it get all products 555');
      productsApi.setUrl(provider.mockService.baseUrl);
      productsApi.getAll().then((response) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual(allProductsResponse);
        done();
      }, done);
    });

    describe('get product by id', () => {
      describe('product exists', () => {
        beforeAll(async () => {
          console.log('beforeAll product exists 333');
          await provider.addInteraction({
            state: 'products id 1 exists',
            uponReceiving: 'get product with id 1',
            withRequest: {
              method: 'GET',
              path: '/products/1',
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: like(productResponse),
            },
          });
          console.log('beforeAll product exists 444');
        });

        it('return product id 1', (done) => {
          console.log('it product exists 555');
          productsApi.setUrl(provider.mockService.baseUrl);
          productsApi.getById(1).then((response) => {
            expect(response.status).toBe(200);
            expect(response.data).toEqual(productResponse);
            done();
          }, done);
        });
      });

      describe('product does not exists', () => {
        beforeAll(async () => {
          console.log('beforeAll product does not exists 333');
          await provider.addInteraction({
            state: 'products id 3 does not exist',
            uponReceiving: 'get error product not found',
            withRequest: {
              method: 'GET',
              path: '/products/3',
            },
            willRespondWith: {
              status: 404,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: like(productNotFoundErrorResponse),
            },
          });
          console.log('beforeAll product does not exists 444');
        });

        it('return not found error', (done) => {
          console.log('it product does not exists 555');
          productsApi.setUrl(provider.mockService.baseUrl);
          expect(productsApi.getById(3)).rejects.toThrow(
            'Request failed with status code 404',
          );
          done();
        });
      });
    });
  });
});
