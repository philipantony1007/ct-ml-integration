import request from 'supertest';
import express from 'express';
import { createApiRoot } from '../client/create.client';
import { getCartById } from './cart.repository ';
import { CartNotFoundError } from '../errors/extendedCustom.error';
import CustomError from '../errors/custom.error';
import { readConfiguration } from '../utils/config.utils';

// Mock the dependencies
jest.mock('../client/create.client');
jest.mock('../utils/config.utils');

const app = express();
app.use(express.json());

const mockCart = { id: 'b3c93b80-83cc-4ca3-9654-af2cb557715b', items: [] }; // Example cart

describe('Cart Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('getCartById', () => {
    it('should return a cart when found', async () => {
      // Arrange
      (createApiRoot as jest.Mock).mockReturnValue({
        carts: () => ({
          withId: () => ({
            get: () => ({
              execute: jest.fn().mockResolvedValue(mockCart), // Mock resolved value
            }),
          }),
        }),
      });

      // Act
      const result = await getCartById('b3c93b80-83cc-4ca3-9654-af2cb557715b');

      // Assert
      expect(result).toEqual(mockCart);
    });

    it('should throw a CartNotFoundError when cart is not found', async () => {
      // Arrange
      (createApiRoot as jest.Mock).mockReturnValue({
        carts: () => ({
          withId: () => ({
            get: () => ({
              execute: jest.fn().mockRejectedValue({ statusCode: 404 }), // Mock rejected value with status code 404
            }),
          }),
        }),
      });

      // Act & Assert
      await expect(getCartById('non-existent-cart-id')).rejects.toThrow(CartNotFoundError);
      await expect(getCartById('non-existent-cart-id')).rejects.toThrow('Cart with ID: non-existent-cart-id is not found.');
    });

    it('should throw a CustomError for other errors', async () => {
      // Arrange
      const errorMessage = 'Internal Server Error';
      (createApiRoot as jest.Mock).mockReturnValue({
        carts: () => ({
          withId: () => ({
            get: () => ({
              execute: jest.fn().mockRejectedValue({ statusCode: 500, message: errorMessage }), // Mock rejected value with different status code
            }),
          }),
        }),
      });

      // Act & Assert
      await expect(getCartById('some-cart-id')).rejects.toThrow(CustomError);
      await expect(getCartById('some-cart-id')).rejects.toThrow('Failed to fetch SKUs from the cart.');
    });
  });


});
