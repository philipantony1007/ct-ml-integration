// cart.service.ts
import { getCartById } from '../repository/cart.repository ';
import CustomError from '../errors/custom.error';
import axios from 'axios';

// Service function to get SKUs from a cart
export const getCartSkus = async (cartId: string): Promise<string[]> => {
  try {
    const cart = await getCartById(cartId);

    return cart.lineItems.map((item: any) => {
      return item.variant.sku;
    });
  } catch (error) {
    console.error(`Error processing SKUs for cart ID ${cartId}:`, error);
    throw error; // Re-throw the error for higher-level handling
  }
};

// Service function to send SKUs to ML model
export const sendSkusToMLModel = async (skus: string[]): Promise<string[]> => {
    try {
      console.log('Sending SKUs:', skus);
      
      const mlModelEndpoint = 'https://45bq36w4k5qmls5x2ax4ofipwm0fkwdz.lambda-url.us-east-1.on.aws/';
      const payload = {
        skus: skus, 
      };
      const response = await axios.post(mlModelEndpoint, payload);
      return response.data.recommended_product_skus;
    
    } catch (error: any) {
      console.error('Error sending SKUs to ML model:', error);
      if (error.response) {
        // If the server responded with a status code outside the 2xx range
        throw new CustomError(error.response.status, error.response.data.message || 'Failed to fetch recommendations from ML model.');
      } else {
        // If the error was caused by a request that triggered an error
        throw new CustomError(500, 'Failed to send SKUs to the ML model.', error);
      }
    }
  };
  
