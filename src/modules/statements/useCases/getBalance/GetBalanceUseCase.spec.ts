import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
      );
  });

  it("Should be able to get the balance", async () => {
    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    const statementDeposit = await statementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: user.id as string
    });

    const statementWithdraw = await statementsRepository.create({
      amount: 50,
      description: "withdraw",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(response).toStrictEqual({
      statement: [statementDeposit, statementWithdraw],
      balance: 50,
    });

  });

  it("Should not be able to get the balance of a non-existent user", async () => {
    
    await statementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: "non-existent"
    });

    await expect(
      getBalanceUseCase.execute({
        user_id: "non-existent"
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
})