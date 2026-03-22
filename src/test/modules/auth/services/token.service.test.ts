import { TokenService } from "../../../../modules/auth/services/token.service";

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  it("should generate a valid token", () => {
    const token = tokenService.generateToken("userId");
    expect(token).toBeDefined();
  });
});