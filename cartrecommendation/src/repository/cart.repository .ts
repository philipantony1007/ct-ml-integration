import CustomError from '../errors/custom.error';
import { createApiRoot } from '../client/create.client';
import { CartNotFoundError } from '../errors/extendedCustom.error';


export const getCartById = async (cartId: string) => {
  try {
    const cart = await createApiRoot()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();

    return cart;
  } catch (error: any) {
    //throw error when cart not found
    if (error.statusCode === 404 || (error.body && error.body.statusCode === 404)) {
      throw new CartNotFoundError(cartId);
    }
    throw new CustomError(500, 'Failed to fetch SKUs from the cart.', error);
  }
};

