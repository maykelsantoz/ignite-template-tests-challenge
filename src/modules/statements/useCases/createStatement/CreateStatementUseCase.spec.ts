import { Statement } from './../../entities/Statement';
import { OperationType } from './../../entities/Statement';

import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from './CreateStatementError';

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to make deposit", async () => {
    const user: ICreateUserDTO = {
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword"
    };

    const userAccountCreated = await createUserUseCase.execute(user);

    expect(userAccountCreated).toHaveProperty("id");

    const user_id = userAccountCreated.id as string

    const deposit: ICreateStatementDTO = {
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test Statement",
    }

    const resultDeposit = await createStatementUseCase.execute(deposit)

    expect(resultDeposit).toHaveProperty("id")
    expect(resultDeposit.user_id).toEqual(user_id)
    expect(resultDeposit.amount).toEqual(deposit.amount)
    expect(resultDeposit.type).toEqual(deposit.type)
  })

  it("should be able to make withdraw", async () => {
    const user: ICreateUserDTO = {
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword"
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
    const user_id = userCreated.id as string

    const deposit: ICreateStatementDTO = {
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test Statement"
    }

    await createStatementUseCase.execute(deposit)

    const withdraw: ICreateStatementDTO = {
      user_id,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "Withdraw test Statement"
    }

    const resultWithdraw = await createStatementUseCase.execute(withdraw)

    expect(resultWithdraw).toBeInstanceOf(Statement)
    expect(resultWithdraw).toHaveProperty("id")
    expect(resultWithdraw.user_id).toEqual(user_id)
    expect(resultWithdraw.type).toEqual(withdraw.type)
    expect(resultWithdraw.amount).toEqual(withdraw.amount)
  })

  it("should not be able to deposit/withdraw with non-existing user", async () => {
    expect(async () => {
      const user_id = "12345687"
      const deposit: ICreateStatementDTO = {
        user_id,
        type: "deposit" as OperationType,
        amount: 100,
        description: "Deposit test Statement with non-existing user",
      }

      await createStatementUseCase.execute(deposit)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
});


