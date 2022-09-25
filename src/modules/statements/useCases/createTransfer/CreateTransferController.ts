import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase'

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: userSenderID } = request.user;
    const { amount, description } = request.body;
    const { userReceiverID } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      userSenderID,
      userReceiverID,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
