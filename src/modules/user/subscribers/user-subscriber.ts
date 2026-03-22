import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "../domain/user";
import { AuditLog } from "../../../shared/entities/AuditLog";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Retorna a entidade que este subscriber está observando.
   */
  listenTo() {
    return User;
  }

  /**
   * Intercepta eventos de inserção (criação de usuários).
   */
  async afterInsert(event: InsertEvent<User>): Promise<void> {
    const auditLogRepository = event.manager.getRepository(AuditLog);

    await auditLogRepository.save({
      entity: "User",
      operation: "CREATE",
      newData: event.entity,
      user: "admin", // Substitua pelo usuário autenticado
    });
  }
}