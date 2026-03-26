import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChannelType } from './enums/channel-type.enum';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
  })
  type: ChannelType;
}
