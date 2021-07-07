import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create an user", () => {

  beforeEach(()=> {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to create an user", async () => {
    const response = await createUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    expect(response).toHaveProperty("id");
  });

  it("Should not be able to create an existent user", async () => {
    await createUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    await expect(createUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    })

    ).rejects.toBeInstanceOf(CreateUserError);
  });
})