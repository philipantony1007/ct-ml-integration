import request from 'supertest';
import express from 'express';
import { ProductProjection } from '@commercetools/platform-sdk';
import { getCartSkus, sendSkusToMLModel } from '../service/cart.service';
import { fetchProducts, uniqueRecommendedProducts } from '../service/product.service';
import { post } from './recommendation.controller';
import { readConfiguration } from '../utils/config.utils';

// Mock the dependencies
jest.mock('../service/cart.service');
jest.mock('../service/product.service');
jest.mock('../utils/logger.utils');
jest.mock('../utils/config.utils');

const app = express();
app.use(express.json());
app.post('/cart-recommendation', post); // Updated the path to match your endpoint

describe('POST /cart-recommendation', () => {
  beforeEach(() => {
    (readConfiguration as jest.Mock).mockClear();
  });

  it('should return recommended products when cartId is valid', async () => {
    // Arrange
    const cartId = 'b3c93b80-83cc-4ca3-9654-af2cb557715b';
    const skus = ['803', '804'];
    const recommendedSkus = ['808', '806'];
    const products: ProductProjection[] = []; // Example products

    (getCartSkus as jest.Mock).mockResolvedValue(skus);
    (sendSkusToMLModel as jest.Mock).mockResolvedValue(recommendedSkus);
    (fetchProducts as jest.Mock).mockResolvedValue(products);
    (uniqueRecommendedProducts as jest.Mock).mockReturnValue(products);

    // Act
    const response = await request(app)
      .post('/cart-recommendation')
      .send({ cartId:cartId }); 

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    expect(response.body.recommendedProducts).toEqual(products);
  });

 
});
