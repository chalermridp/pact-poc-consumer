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
        .uponReceiving('a request for the products with the builder pattern')
        .given('have a list of products')
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

    it('returns the correct response', (done) => {
      productsAPI.setUrl(url);
      productsAPI.getAll().then((response: any) => {
        expect(response.status).toBe(200);
        expect(response.data).toEqual(allProductsResponse);
        done();
      }, done);
    });
  });
});
