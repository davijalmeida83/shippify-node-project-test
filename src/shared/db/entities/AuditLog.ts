import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['entity', 'operation', 'timestamp']) // Índice composto para consultas frequentes
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    entity!: string; // Nome da entidade afetada (ex: 'User', 'Order')

  @Column()
    operation!: string; // Tipo de operação (ex: 'INSERT', 'UPDATE', 'DELETE')

  @Column('json', { nullable: true })
    oldData!: Record<string, any> | null; // Dados antes da alteração

  @Column('json', { nullable: true })
    newData!: Record<string, any> | null; // Dados após a alteração

  @Column({ nullable: true })
    user!: string | null; // Usuário responsável pela operação

  @CreateDateColumn()
    timestamp!: Date; // Data e hora da operação
}