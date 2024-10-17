import { Request, Response } from 'express';
import CustomError from '../errors/custom.error';
import { createApiRoot } from '../client/create.client';
import axios from 'axios';

// Function to get SKUs from a cart by its ID
const getCartSkusById = async (cartid: string): Promise<string[]> => {
  const cart = await createApiRoot()
    .carts()
    .withId({ ID: cartid })
    .get()
    .execute();

  return cart.body.lineItems.map((item: any) => item.variant.sku);
};

// Function to send SKUs to the Lambda function and receive product SKUs
const sendSkusToMLModel = async (skus: string[]): Promise<string[]> => {
  try {
    const response = await axios.post('https://45bq36w4k5qmls5x2ax4ofipwm0fkwdz.lambda-url.us-east-1.on.aws/', {
      skus: skus,
    });
    console.log('Response from Lambda:', response.data);
    
    // Ensure the response contains the expected key
    if (response.data.recommended_product_skus) {
      return response.data.recommended_product_skus; // Adjusted to match the new response structure
    } else {
      throw new CustomError(500, 'No recommended product SKUs found in Lambda response');
    }
  } catch (error) {
    console.error('Error sending SKUs to Lambda:', error);
    throw new CustomError(500, 'Failed to send SKUs to Lambda');
  }
};

// Function to get recommended products by SKU
const getProductsBySku = async (sku: string): Promise<any[]> => {
  const filterQuery = `variants.sku:"${sku}"`;

  const recommendedProducts = await createApiRoot()
    .productProjections()
    .search()
    .get({ queryArgs: { 'filter.query': filterQuery } })
    .execute();

  return recommendedProducts.body.results;
};

// Function to remove duplicate products based on product ID
const uniqueRecommendedProducts = (products: any[]): any[] => {
  return products.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );
};

// Main POST handler
export const post = async (request: Request, response: Response) => {
  const { cartid } = request.body;

  if (!cartid) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }

  try {
    // Fetch the SKUs from the cart
    const skus = await getCartSkusById(cartid);
    console.log('SKUs from cart:', skus);

    if (skus.length === 0) {
      throw new CustomError(404, 'No SKUs found in the cart.');
    }

    // Send SKUs to the ML model and get the recommended product SKUs back
    const productSkus = await sendSkusToMLModel(skus);
    console.log('Recommended product SKUs:', productSkus);

    // Array to hold all recommended products
    let allRecommendedProducts: any[] = [];

    // Loop through each SKU returned from the ML model and fetch recommended products
    for (const sku of productSkus) {
      try {
        const recommendedProducts = await getProductsBySku(sku);

        if (recommendedProducts.length > 0) {
          console.log(`Product ID for SKU "${sku}": ${recommendedProducts[0].id}`);
          allRecommendedProducts.push(recommendedProducts[0]);
        } else {
          console.log(`No products found for SKU: ${sku}`);
        }
      } catch (err) {
        console.error(`Error fetching products for SKU: ${sku}`, err);
      }
    }

    // Remove duplicates from the results based on product ID
    const uniqueProducts = uniqueRecommendedProducts(allRecommendedProducts);

    // Send the unique products as the response
    response.json({ recommendedProducts: uniqueProducts });
  } catch (error) {
    console.error('Error fetching cart or products:', error);
    throw new CustomError(500, 'Internal Server Error');
  }
};
