import { RegisterService } from "../../../../modules/user/services/register.service";
import { TokenService } from "../../../../modules/auth/services/token.service";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { AppError } from "../../../../shared/errors/app-error";

describe("RegisterService", () => {
  let registerService: RegisterService;
  let mockUserRepository: any;
  let mockTokenService: TokenService;
  let mockToPublicUserService: ToPublicUserService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    mockTokenService = new TokenService();
    mockToPublicUserService = new ToPublicUserService();

    registerService = new RegisterService(
      mockUserRepository,
      mockToPublicUserService,
      mockTokenService
    );
  });

  it("should throw an error if required fields are missing", async () => {
    await expect(
      registerService.execute({ name: "", email: "", password: "" })
    ).rejects.toThrow(AppError);
  });

  it("should throw an error if user already exists", async () => {
    mockUserRepository.findByEmail.mockReturnValue({});

    await expect(
      registerService.execute({ name: "Test", email: "test@example.com", password: "password" })
    ).rejects.toThrow("usuário já existe");
  });

  it("should create a new user and return token", async () => {
    mockUserRepository.findByEmail.mockReturnValue(null);
    mockUserRepository.create.mockReturnValue({ id: "userId" });

    jest.spyOn(mockTokenService, "generateToken").mockReturnValue("token");

    const result = await registerService.execute({
      name: "Test",
      email: "test@example.com",
      password: "password",
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });
});