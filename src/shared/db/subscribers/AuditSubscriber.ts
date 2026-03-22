import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLog } from '../entities/AuditLog';
import { logger } from '../../utils/logger';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    await this.log(event, 'INSERT');
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    await this.log(event, 'UPDATE');
  }

  async afterRemove(event: RemoveEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    await this.log(event, 'DELETE');
  }

  private async log(event: any, operation: string) {
    try {
      const auditLog = new AuditLog();
      auditLog.entity = event.metadata.name;
      auditLog.operation = operation;
      auditLog.oldData = operation === 'INSERT' ? null : JSON.stringify(event.databaseEntity);
      auditLog.newData = operation === 'DELETE' ? null : JSON.stringify(event.entity);
      auditLog.user = 'system';
      
      logger.info(`[AuditSubscriber] Salvando auditoria...`);
      await event.manager.save(AuditLog, auditLog);
    } catch (error) {
      logger.error(`[AuditSubscriber] Erro ao salvar auditoria:`, error);
      throw error;
    }
  }
}