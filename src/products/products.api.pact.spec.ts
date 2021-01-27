import { Test, TestingModule } from '@nestjs/testing';
import { Interaction, Pact } from '@pact-foundation/pact';
import { like } from '@pact-foundation/pact/dsl/matchers';
import path = require('path');
import { ProductsAPI } from './products.api';

describe('Pack Testing', () => {
  const url = 'http://localhost:3000';

  const provider = new Pact({
    consumer: 'PactPocConsumer',
    provider: 'PactPocProvider',
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'info',
    spec: 2,
  });

  let productsAPI: ProductsAPI;
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

  beforeAll(() =>
    provider.setup().then(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [ProductsAPI],
      }).compile();
      productsAPI = await moduleRef.resolve(ProductsAPI);
    }),
  );

  afterAll(() => {
    provider.finalize();
  });

  afterEach(() => {
    provider.verify();
  });

  describe('getting all products', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given('products exist')
        .uponReceiving('get all products')
        .withRequest({
          method: 'GET',
          path: '/products',
          headers: {
            Accept: 'application/json',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like(allProductsResponse),
        });
      return provider.addInteraction(interaction);
    });

    it('returns all products', (done) => {
      productsAPI.setUrl(url);
      productsAPI.getAll().then((response: any) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual(allProductsResponse);
        done();
      }, done);
    });
  });

  describe('getting product by id', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given('product id 1 exists')
        .uponReceiving('get product with id 1')
        .withRequest({
          method: 'GET',
          path: '/products/1',
          headers: {
            Accept: 'application/json',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like(productResponse),
        });
      return provider.addInteraction(interaction);
    });

    it('returns product with id 1', (done) => {
      productsAPI.setUrl(url);
      productsAPI.getById(1).then((response: any) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual(productResponse);
        done();
      }, done);
    });
  });

  describe('getting product by id which not exist', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given('product id 555 not exist')
        .uponReceiving('get product not found error')
        .withRequest({
          method: 'GET',
          path: '/products/555',
          headers: {
            Accept: 'application/json',
          },
        })
        .willRespondWith({
          status: 404,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like(productNotFoundErrorResponse),
        });
      return provider.addInteraction(interaction);
    });

    it('returns product not found error', () => {
      productsAPI.setUrl(url);
      expect(productsAPI.getById(555)).rejects.toThrow(
        'Request failed with status code 404',
      );
    });
  });
});
