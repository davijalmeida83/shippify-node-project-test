import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { AuditLog } from '../entities/AuditLog';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    await this.log(event, 'INSERT');
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.log(event, 'UPDATE');
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.log(event, 'DELETE');
  }

  private async log(event: any, operation: string) {
    const auditLog = new AuditLog();
    auditLog.entity = event.metadata.name;
    auditLog.operation = operation;
    auditLog.oldData = operation === 'INSERT' ? null : event.databaseEntity;
    auditLog.newData = operation === 'DELETE' ? null : event.entity;
    auditLog.user = 'system'; // Replace with actual user context if available
    await event.manager.save(AuditLog, auditLog);
  }
}