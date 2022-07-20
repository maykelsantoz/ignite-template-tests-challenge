import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show profile user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to list profile", async () => {
    const user = {
      name: "user name",
      email: "user@challenger.com.br",
      password: "userpassword",
    };

    const userProfileCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });


    expect(userProfileCreated).toHaveProperty("id")
    const showUserProfile = await showUserProfileUseCase.execute(userProfileCreated.id as string)

    const passwordMatch = await compare(user.password, showUserProfile.password);

    expect(showUserProfile).toHaveProperty("id")
    expect(showUserProfile.email).toEqual(user.email)
    expect(showUserProfile.name).toEqual(user.name)
    expect(passwordMatch).toBe(true)
  });

  it("should not be able to list nonexistent user profile", async () => {
    expect(async () => {
      const user_id = "123456"
      await showUserProfileUseCase.execute(user_id)
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
});

