import { LoginService } from "../../../../modules/auth/services/login.service";
import { TokenService } from "../../../../modules/auth/services/token.service";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { AppError } from "../../../../shared/errors/app-error";

describe("LoginService", () => {
  let loginService: LoginService;
  let mockUserRepository: any;
  let mockTokenService: TokenService;
  let mockToPublicUserService: ToPublicUserService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    mockTokenService = new TokenService();
    mockToPublicUserService = new ToPublicUserService();

    loginService = new LoginService(
      mockUserRepository,
      mockToPublicUserService,
      mockTokenService
    );
  });

  it("should throw an error if email or password is missing", async () => {
    await expect(
      loginService.execute({ email: "", password: "" })
    ).rejects.toThrow(AppError);
  });

  it("should throw an error if user is not found", async () => {
    mockUserRepository.findByEmail.mockReturnValue(null);

    await expect(
      loginService.execute({ email: "test@example.com", password: "password" })
    ).rejects.toThrow("credenciais inválidas");
  });

  it("should return a token and user for valid credentials", async () => {
    mockUserRepository.findByEmail.mockReturnValue({
      email: "test@example.com",
      passwordHash: "hashedPassword",
    });

    jest.spyOn(mockTokenService, "generateToken").mockReturnValue("token");

    const result = await loginService.execute({
      email: "test@example.com",
      password: "password",
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });
});