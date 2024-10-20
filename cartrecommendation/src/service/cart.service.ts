// cart.service.ts
import { getCartById } from '../repository/cart.repository ';
import CustomError from '../errors/custom.error';
import { Cart } from '@commercetools/platform-sdk';

// Service function to get SKUs from a cart
export const getCartSkus = async (cartId: string): Promise<string[]> => {
    try {
      const cart:Cart = await getCartById(cartId);
      
      // Collect the SKUs into an array
      const skus: string[] = cart.lineItems.map((item: any) => item.variant.sku);
      console.log(skus);
      return skus;

      
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error(`Error processing SKUs for cart ID ${cartId}:`, error);
      throw new CustomError(500, 'Error in service layer.');
    }
  };
  
import { createMLClient } from '../client/ml.client';
// Service function to send SKUs to ML model
export const sendSkusToMLModel = async (skus: string[]): Promise<string[]> => {
    try {
      console.log('Sending SKUs:', skus);
      
      const mlClient = createMLClient()
      const payload = {
        skus: skus, 
      };

      const response = await mlClient.predict(payload);
      return response.data.recommended_product_skus;
    
    } catch (error: any) {
        console.error('Error sending SKUs to ML model:', error);
        throw new CustomError(500, error.message, error);
    }
  };
  
