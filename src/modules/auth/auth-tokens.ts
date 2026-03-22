export const AUTH_TOKENS = {
    AuthService: "AuthService",
    TokenService: "TokenService",
    JWT_SECRET: process.env.JWT_PRIVATE_SECRET || "your-secret-key",
} as const;
