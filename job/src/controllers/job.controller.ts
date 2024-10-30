import { Request, Response } from 'express';
import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';
import { allOrders } from '../repository/order.repository';

/**
 * Exposed job endpoint.
 *
 * @param {Request} _request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (_request: Request, response: Response) => {
  try {
    // Get the orders
    console.log("Fetching orders...");
    const orders = await allOrders({ sort: ['lastModifiedAt'] });

    // Initialize an array to hold the SKU associations
    const associations: string[][] = [];

    // Log all SKUs from line items and build the associations array
    if (orders.results && orders.results.length > 0) {
      orders.results.forEach((order, orderIndex) => {
        console.log(`Order ${orderIndex + 1}:`);
        const skuList: string[] = [];
        order.lineItems.forEach((item, itemIndex) => {
          const sku = item.variant.sku;
          if (sku) {
            skuList.push(sku);
            console.log(`  Line Item ${itemIndex + 1} SKU: ${sku}`);
          }
        });
        if (skuList.length > 0) {
          associations.push(skuList);
        }
      });
    } else {
      console.log('No orders found.');
    }

    // Log the total number of orders
    logger.info(`There are ${orders.total} orders!`);

    // Send the associations array as the response
    response.status(200).json({
      associations
    });
  } catch (error) {
    logger.error('Error retrieving all orders:', error);

    throw new CustomError(
      500,
      'Internal Server Error - Error retrieving all orders from the commercetools SDK'
    );
  }
};
