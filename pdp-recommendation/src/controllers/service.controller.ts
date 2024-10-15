import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError from '../errors/custom.error';
import { cartController } from './cart.controller';
import { createApiRoot } from '../client/create.client';

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller
 * and returns it to the correct controller. We should be use 3. `Cart`, `Order` and `Payments`
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  
  const { cartid } = request.body;

  if (!cartid) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }


  if (cartid) {
   const cart =  await createApiRoot()
      .carts()
      .withId({ ID: cartid })
      .get()
      .execute();

      const skus = cart.body.lineItems.map((item: any) => item.variant.sku);

      // Log the SKUs
      console.log(skus);
  
      // Send the SKUs as the response
      response.json({ skus });
    // Work with the product
  }
};
