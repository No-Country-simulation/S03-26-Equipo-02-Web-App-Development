// entities/template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  type: string;

  @Column({ type: 'json', nullable: true })
  placeholders: Record<string, any>;
}