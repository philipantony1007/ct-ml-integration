import { Request, Response } from 'express';
import { getCartSkus } from '../service/cart.service'; // Import the service function
import { sendSkusToMLModel } from '../service/cart.service';
import { CartIdNotFoundError } from '../errors/extendedCustom.error';
import CustomError from '../errors/custom.error';
import { fetchProducts, uniqueRecommendedProducts } from '../service/product.service';


export const post = async (request: Request, response: Response) => {
  
  if (!request.body || !request.body.cartId) {
    throw new CartIdNotFoundError();
  }

  const { cartId } = request.body;

  try {
    const skus = await getCartSkus(cartId);
    console.log('SKUs from cart:', skus);

    const recommended_product_skus = await sendSkusToMLModel(skus);
    console.log(recommended_product_skus);

    const allRecommendedProducts = await fetchProducts(recommended_product_skus);
    console.log(allRecommendedProducts)

    const uniqueProducts = uniqueRecommendedProducts(allRecommendedProducts);

    response.json({ recommendedProducts: uniqueProducts });

  
  } catch (error) {
    console.error('Error fetching cart or products:', error);
    throw new CustomError(500, 'Internal Server Error');
  }
  
};
