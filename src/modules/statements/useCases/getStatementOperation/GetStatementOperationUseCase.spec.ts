import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository"
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operations", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("Should be able to get an operation statement", async () => {
    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    const statement = await statementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: user.id as string
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(response).toBe(statement);
  });

  it("Should not be able to get an operation statement of a non-existent user", async () => {
    
    const statement = await statementsRepository.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "College funds",
      user_id: "non-existent"
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "non-existent",
        statement_id: statement.id as string,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a non-existent operation statement", async () => {
    const user = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "1234",
    });

    await expect(
        getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "non-existent"
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})