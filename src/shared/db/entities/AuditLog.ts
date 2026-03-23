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

  @Column('longtext', { nullable: true })
    oldData!: string | null; // Dados antes da alteração (JSON serializado)

  @Column('longtext', { nullable: true })
    newData!: string | null; // Dados após a alteração (JSON serializado)

  @Column('varchar', { length: 255, nullable: true })
    user!: string | null; // Usuário responsável pela operação

  @CreateDateColumn()
    timestamp!: Date; // Data e hora da operação
}