import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement",() => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    )
  });

  it("should be able to create a deposit", async () => {

    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    const response = await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: user.id as string
    });

    expect(response).toHaveProperty("id")

  });

  it("should be able to create a withdraw", async () => {

    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: user.id as string
    });

    const response = await createStatementUseCase.execute({
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "College funds",
      user_id: user.id as string
    });

    expect(response).toHaveProperty("id")
  });

  it("should not be able to create a withdraw with no funds", async () => {

    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 0,
      description: "College funds",
      user_id: user.id as string
    });

    await expect(
      createStatementUseCase.execute({
        type: OperationType.WITHDRAW,
        amount: 50,
        description: "College funds",
        user_id: user.id as string
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a withdraw with non-existent user", async () => {

    await expect(
      createStatementUseCase.execute({
        type: OperationType.WITHDRAW,
        amount: 50,
        description: "College funds",
        user_id: "non-existent"
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});