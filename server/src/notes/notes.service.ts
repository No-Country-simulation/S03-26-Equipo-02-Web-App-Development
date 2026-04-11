import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from 'src/entitys/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/entitys/contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const contact = await this.contactRepository.findOne({
      where: { id: createNoteDto.contactId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const note = this.noteRepository.create({
      description: createNoteDto.description,
      contact,
    });

    return await this.noteRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find({ relations: ['contact'] });
  }

  async findByContact(contactId: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { contact: { id: contactId } },
      relations: ['contact'],
    });
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['contact'],
    });

    if (!note) throw new NotFoundException('Note not found');

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);

    if (updateNoteDto.contactId) {
      const contact = await this.contactRepository.findOne({
        where: { id: updateNoteDto.contactId },
      });

      if (!contact) throw new NotFoundException('Contact not found');

      note.contact = contact;
    }

    const updated = this.noteRepository.merge(note, updateNoteDto);
    return this.noteRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.noteRepository.remove(note);
  }
}
