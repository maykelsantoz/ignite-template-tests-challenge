import { OperationType } from "@modules/statements/entities/Statement";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ userSenderID, amount, userReceiverID, description }: ICreateTransferDTO) {
    //const userSenderID = await this.usersRepository.findById(senderUserID);
    const userReceiverExist = await this.usersRepository.findById(userReceiverID);

    if (!userReceiverExist) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: userSenderID });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    if (userSenderID === userReceiverID) {
      throw new CreateTransferError.UserSendAsUserReceiver()
    }

    const statementOperation = await this.statementsRepository.create({
      user_id: userReceiverID,
      sender_id: userSenderID,
      amount,
      type: 'transfer' as OperationType,
      description
    });

    return statementOperation;
  }
}
