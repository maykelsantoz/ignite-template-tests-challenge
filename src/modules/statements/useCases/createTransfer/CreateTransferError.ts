import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class UserSendAsUserReceiver extends AppError {
    constructor() {
      super("The receiving user can't be the same sending user", 400);
    }
  }
}
