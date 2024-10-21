
import { getCartById } from '../repository/cart.repository ';
import CustomError from '../errors/custom.error';
import { CartNotFoundError, InvalidMLResponse, NoLineItemsCartError } from '../errors/extendedCustom.error';
import { readConfiguration } from '../utils/config.utils';
import axios from 'axios';

export const getCartSkus = async (cartId: string): Promise<string[]> => {
  try {
    const cart = await getCartById(cartId);

    if (!cart.body || !cart.body.lineItems || cart.body.lineItems.length === 0) {
      throw new NoLineItemsCartError(cartId); 
    }

    const skus: string[] = cart.body.lineItems.map((item: any) => item.variant.sku);
    return skus;  

  } catch (error: any) {
    console.error(`Error fetching SKUs for cart ID ${cartId}:`, error);

    if (error instanceof NoLineItemsCartError || error instanceof CartNotFoundError) {
      throw error; 
    }

    throw new CustomError(500, 'Error in service layer while fetching SKUs.');
  }
};

export const sendSkusToMLModel = async (skus: string[]): Promise<string[]> => {
  try {
    console.log('Sending SKUs:', skus);

    const payload = {
      skus: skus,
    };

    const config = readConfiguration();
    const endpointUrl = config.ml_model_endpoint;
  
    const axiosInstance = axios.create({
      baseURL: endpointUrl,
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if required
      },
    });

    const recommendedSkus = await axiosInstance.post('', payload);


    if (!recommendedSkus.data.recommended_product_skus ||
       !Array.isArray(recommendedSkus.data.recommended_product_skus)) {
      throw new InvalidMLResponse();
    }

    // Return the recommended SKUs
    return recommendedSkus.data.recommended_product_skus;
  } catch (error: any) {
    console.error('Error sending SKUs to ML model:', error);

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(500, 'Error processing SKUs in ML model');
  }
};
  
