import { hash } from "bcryptjs";


import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create an user authentication", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to authenticate an user", async () => {

    await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: await hash("1234", 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: "johndoe@example.com",
      password: "1234",
    })

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");

  });

})