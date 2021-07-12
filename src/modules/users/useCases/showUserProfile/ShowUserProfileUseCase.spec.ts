import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository"
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show authenticated user's information", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should be able to show an user", async () => {
    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toBe(user);
  });

  it("Should not be able to show an user", async () => {
    
    expect(async () => {
      await showUserProfileUseCase.execute("non-existent user");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

})