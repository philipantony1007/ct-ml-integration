import CustomError from '../errors/custom.error';

// Custom error for when cart ID is not found
export class CartIdNotFoundError extends CustomError {
  constructor() {
    super(400, `Bad request - Missing "cartId" in the request body or invalid JSON format.`);
  }
}


// Custom error for when there are no SKUs found in the cart
export class NoSkusInCartError extends CustomError {
  constructor() {
    super(404, 'No SKUs found in the cart.');
  }
}


export class NoLineItemsCartError extends CustomError {
    constructor(cartid:string) {
      super(404, `Cart with ID: ${cartid} contains no line items.`);
    }
  }


  export class CartNotFoundError extends CustomError {
    constructor(cartid:string) {
      super(404, `Cart with ID: ${cartid} is not found.`);
    }
  }




