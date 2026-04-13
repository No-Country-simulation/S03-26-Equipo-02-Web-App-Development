import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entitys/note.entity';
import { Contact } from 'src/entitys/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Contact])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
