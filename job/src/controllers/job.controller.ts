import { Request, Response } from 'express';
import CustomError from '../errors/custom.error';
import { logger } from '../utils/logger.utils';
import { allOrders } from '../repository/order.repository';
import { mapOrderAssociations } from '../service/order.service';
import { OrderPagedQueryResponse } from '@commercetools/platform-sdk';
import { uploadToS3 } from '../service/s3.service';


export const post = async (_request: Request, response: Response) => {
  try {
    // Fetch the orders
    logger.info("Fetching orders...");

    //const orders: OrderPagedQueryResponse = await allOrders({ sort: ['lastModifiedAt'] });

    const orders = {
      "limit": 10,
      "count": 0,
      "total": 0,
      "offset": 0,
      "results": [
        {
          "type": "Order",
          "id": "f4619002-ead2-42e9-bbea-102f30c15232",
          "version": 1,
          "versionModifiedAt": "2024-10-17T05:16:45.125Z",
          "lastMessageSequenceNumber": 1,
          "createdAt": "2024-10-17T05:16:45.125Z",
          "lastModifiedAt": "2024-10-17T05:16:45.125Z",
          "lastModifiedBy": {
              "isPlatformClient": true,
              "attributedTo": {
                  "clientId": "R2IJYphwGY8FR1vbYMkC4h-M",
                  "source": "Import"
              }
          },
          "createdBy": {
              "isPlatformClient": true,
              "attributedTo": {
                  "clientId": "R2IJYphwGY8FR1vbYMkC4h-M",
                  "source": "Import"
              }
          },
          "orderNumber": "SO43702",
          "customerEmail": "colin45@adventure-works.com",
          "totalPrice": {
              "type": "centPrecision",
              "currencyCode": "USD",
              "centAmount": 361555,
              "fractionDigits": 2
          },
          "completedAt": "2019-07-01T00:00:00.000Z",
          "orderState": "Complete",
          "syncInfo": [],
          "returnInfo": [],
          "taxMode": "External",
          "inventoryMode": "None",
          "taxRoundingMode": "HalfEven",
          "taxCalculationMode": "LineItemLevel",
          "origin": "Customer",
          "shippingMode": "Single",
          "shipping": [],
          "lineItems": [
              
          ],
          "customLineItems": [],
          "transactionFee": false,
          "discountCodes": [],
          "directDiscounts": [],
          "itemShippingAddresses": [],
          "refusedGifts": []
      }
      ]
    }

    // Process orders to get SKU associations
    const associations = mapOrderAssociations(orders);

    
    const isUploaded = await uploadToS3({ associations });
    
    if (isUploaded) {
      response.status(200).json({ message: "Successfully uploaded data to S3" });
    } else {
      throw new CustomError(500, 'S3 upload failed');
    }
  } catch (error) {
    if (error instanceof CustomError) {
      logger.error('Error 0 orders found:');
      throw error;
    }
    throw new CustomError(500, 'Internal Server Error');
  }
};
