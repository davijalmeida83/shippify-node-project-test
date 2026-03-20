import { injectable } from "tsyringe";
import { User } from "../domain/user";
import { IUserRepository } from "./interfaces/user-repository.interface";

@injectable()
export class UserRepository implements IUserRepository {
  private readonly usersByEmail = new Map<string, User>();

  findByEmail(email: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();
    return this.usersByEmail.get(normalizedEmail) ?? null;
  }

  create(user: User): User {
    const normalizedEmail = user.email.trim().toLowerCase();
    this.usersByEmail.set(normalizedEmail, {
      ...user,
      email: normalizedEmail,
    });
    return user;
  }
}

// Este arquivo foi movido para o módulo 'user'.
// Atualize os imports e referências para refletir a nova localização.
