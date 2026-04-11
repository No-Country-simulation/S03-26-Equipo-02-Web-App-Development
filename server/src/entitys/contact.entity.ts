import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SegmentType } from './enums/segment-type.enum';
import { Message } from './message.entity';
import { Tag } from './tag.entity';
import { Task } from './task.entity';
import { Note } from './note.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: SegmentType,
    default: SegmentType.LEAD,
  })
  segmentType: SegmentType;

  @OneToMany(() => Message, (message) => message.contact)
  messages: Message[];

  @ManyToMany(() => Tag, (tag) => tag.contacts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Task, (task) => task.contact)
  tasks: Task[];

  @OneToMany(() => Note, (note) => note.contact)
  notes: Note[];
}
