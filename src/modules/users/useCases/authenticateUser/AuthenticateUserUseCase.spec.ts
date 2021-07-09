import { hash } from "bcryptjs";


import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


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

  it("Should not be able to authenticate an inexistent user", async () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "johndoe@example.com",
        password: "1234",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it("Should not be able to authenticate an user with a wrong password", async () => {

    await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: await hash("1234", 8),
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "johndoe@example.com",
        password: "wrong password",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it("Should not be able to authenticate an user with a wrong email", async () => {

    await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: await hash("1234", 8),
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "wrongpassword@example.com",
        password: "1234",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

})