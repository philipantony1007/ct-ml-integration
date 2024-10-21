import { Request, Response } from 'express';
import { getCartSkus } from '../service/cart.service';
import { sendSkusToMLModel } from '../service/cart.service';
import { CartIdNotFoundError } from '../errors/extendedCustom.error';
import CustomError from '../errors/custom.error';
import { fetchProducts, uniqueRecommendedProducts } from '../service/product.service';
import { logger } from '../utils/logger.utils';
import { ProductProjection } from '@commercetools/platform-sdk';

export const post = async (request: Request, response: Response) => {

  if (!request.body || !request.body.cartId) {
    throw new CartIdNotFoundError();
  }
  const { cartId } = request.body;

  try {
    const skus: string[] = await getCartSkus(cartId);
    logger.info('SKUs from cart:', skus);
    console.log(skus)

    const recommended_product_skus:string[] = await sendSkusToMLModel(skus);

    const products: ProductProjection[] = await fetchProducts(recommended_product_skus);

    const uniqueProducts:ProductProjection[] = uniqueRecommendedProducts(products);

    response.json({ recommendedProducts: uniqueProducts });

  } catch (error) {
    console.error('Error fetching cart or products:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, 'Internal Server Error');
  }
};
