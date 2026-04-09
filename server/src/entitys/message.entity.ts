import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageStatus } from './enums/message-status.enum';
import { Contact } from './contact.entity';
import { Channel } from './channel.entity'; // ✅ FIX

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contact, (contact) => contact.messages)
  contact: Contact;

  @ManyToOne(() => Channel)
  channel: Channel;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    enumName: 'message_status_enum',
  })
  status: MessageStatus;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  direction: 'sent' | 'received';

  @Column({ nullable: true })
  twilioSid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
