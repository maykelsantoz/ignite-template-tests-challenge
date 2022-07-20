import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should able tocreate a new User', async () => {
    const user = await createUserUseCase.execute({
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword",
    });

    const userAccountCreated = await inMemoryUsersRepository.findByEmail(user.email)

    expect(userAccountCreated).toHaveProperty("id")
  });

  it('should not be able to create a new user already existing', async () => {
    expect(async () => {
      const user = {
        name: "user name",
        email: "user@challenger.com.br",
        password: "userpassword",
      }

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  });
});
