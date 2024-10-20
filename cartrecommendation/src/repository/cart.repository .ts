// cart.repository.ts
import CustomError from '../errors/custom.error';
import { createApiRoot } from '../client/create.client';
import { CartNotFoundError, NoLineItemsCartError } from '../errors/extendedCustom.error';
import { Cart } from '@commercetools/platform-sdk';

// Repository function to get cart data by ID
export const getCartById = async (cartId: string) => {
  try {
    const cart = await createApiRoot()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();

    if (!cart.body || !cart.body.lineItems || cart.body.lineItems.length === 0) {
      throw new NoLineItemsCartError(cartId); 
    }

    return cart.body;


  } catch (error: any) {
      console.error(`Error fetching SKUs for cart ID ${cartId}`, error);
      if (error instanceof NoLineItemsCartError) {
        throw error;
      }
      else if (error.statusCode === 404 || (error.body && error.body.statusCode === 404)) {
        throw new CartNotFoundError(cartId);
      } 
      else{
        throw new CustomError(500, 'Failed to fetch SKUs from the cart.', error);
      }
  }
};
