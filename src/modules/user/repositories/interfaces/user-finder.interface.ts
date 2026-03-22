import { User } from "../../domain/user";

/**
 * Contrato para operações de leitura de usuários.
 * Define métodos para consultar usuários no banco de dados.
 */
export interface IUserFinder {
  /**
   * Busca um usuário pelo email.
   * @param email Email do usuário
   * @returns Promessa com o usuário encontrado ou null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca um usuário pelo ID.
   * @param id Identificador único do usuário
   * @returns Promessa com o usuário encontrado ou null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Retorna todos os usuários cadastrados.
   * @returns Promessa com lista de usuários
   */
  findAll(): Promise<User[]>;
}
