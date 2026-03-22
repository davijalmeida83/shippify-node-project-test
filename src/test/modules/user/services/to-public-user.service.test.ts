import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { User } from "../../../../modules/user/domain/user";

describe("ToPublicUserService", () => {
  let toPublicUserService: ToPublicUserService;

  beforeEach(() => {
    toPublicUserService = new ToPublicUserService();
  });

  it("should convert a user to PublicUserResponseDto", () => {
    const user: User = {
      id: "userId",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashedPassword",
    };

    const result = toPublicUserService.execute(user);

    expect(result).toEqual({
      id: "userId",
      name: "Test User",
      email: "test@example.com",
    });
  });
});