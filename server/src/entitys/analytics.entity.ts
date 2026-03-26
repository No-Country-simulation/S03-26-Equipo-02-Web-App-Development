import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  contactsActive: number;

  @Column({ default: 0 })
  messagesSent: number;

  @Column({ default: 0 })
  messagesNotRead: number;

  @Column({ type: 'float', default: 0 })
  responseRate: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateTime: Date;

  @Column({ default: 0 })
  taskExpiration: number;
}
