import { Test, TestingModule } from '@nestjs/testing';
import { Interaction, Pact } from '@pact-foundation/pact';
import { like } from '@pact-foundation/pact/dsl/matchers';
import path = require('path');
import { ProductsAPI } from './products.api';

describe('Pack Testing', () => {
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

  beforeAll(async () => {
    console.log('beforeAll');
    await provider.setup();

    const interaction = new Interaction()
      .given('products exist')
      .uponReceiving('get all products')
      .withRequest({
        method: 'GET',
        path: '/products',
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: like(allProductsResponse),
      });
    await provider.addInteraction(interaction);

    const interaction2 = new Interaction()
      .given('product id 1 exists')
      .uponReceiving('get product with id 1')
      .withRequest({
        method: 'GET',
        path: '/products/1',
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: like(productResponse),
      });
    await provider.addInteraction(interaction2);

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ProductsAPI],
    }).compile();
    productsAPI = await moduleRef.resolve<ProductsAPI>(ProductsAPI);
    productsAPI.setUrl(provider.mockService.baseUrl);
  });

  afterAll(() => {
    console.log('afterAll');
    provider.finalize();
  });

  afterEach(() => {
    console.log('afterEach');
    provider.verify();
  });

  describe('getting all products', () => {
    console.log('hello 111');

    it('returns all products', async () => {
      console.log('start 111');
      const response = await productsAPI.getAll();
      expect(response.status).toBe(200);
      expect(response.data).toEqual(allProductsResponse);
      console.log('finish 111');
    });
  });

  describe('getting product by id', () => {
    console.log('hello 222');

    it('returns product with id 1', async () => {
      console.log('start 222');
      const response = await productsAPI.getById(1);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(productResponse);
      console.log('finish 222');
    });
  });

  // describe('getting product by id', () => {
  //   console.log('hello 333');
  //   beforeAll(async () => {
  //     const interaction = new Interaction()
  //       .given('product id 555 not exist')
  //       .uponReceiving('get product not found error')
  //       .withRequest({
  //         method: 'GET',
  //         path: '/products/555',
  //       })
  //       .willRespondWith({
  //         status: 404,
  //         headers: {
  //           'Content-Type': 'application/json; charset=utf-8',
  //         },
  //         body: like(productNotFoundErrorResponse),
  //       });
  //     return await provider.addInteraction(interaction);
  //   });

  //   it('returns product not found error', async () => {
  //     productsAPI.setUrl(provider.mockService.baseUrl);
  //     const response = await productsAPI.getById(555);
  //     expect(response).rejects.toThrow('Request failed with status code 404');
  //   });
  // });
});
