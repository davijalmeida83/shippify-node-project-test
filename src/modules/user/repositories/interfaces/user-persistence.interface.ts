import { User } from "../../domain/user";

/**
 * Critério para exclusão de usuários.
 */
type DeleteUserCriteria = Partial<{ id: string }>;

/**
 * Contrato para operações de persistência de usuários.
 * Define métodos para criação, atualização e exclusão de usuários.
 */
export interface IUserPersistence {
  /**
   * Cria uma nova instância de usuário em memória (sem persistir).
   * @param user Dados do usuário
   * @returns Instância do usuário criada
   */
  create(user: User): User;

  /**
   * Persiste um usuário no banco de dados (atualiza se já existe).
   * @param user Usuário a ser salvo
   * @returns Promessa com o usuário salvo
   */
  save(user: User): Promise<User>;

  /**
   * Remove um usuário do banco de dados.
   * @param criteria Critério de exclusão (por ID)
   * @returns Promessa com número de registros afetados
   */
  delete(criteria: DeleteUserCriteria): Promise<{ affected?: number | null }>;
}
