import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entitys/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

import { SegmentType } from '../entitys/enums/segment-type.enum';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findOrCreateByPhone(phone: string, firstName?: string): Promise<Contact> {
    let contact = await this.contactRepository.findOne({ where: { phone } });
    if (!contact) {
      contact = this.contactRepository.create({
        phone,
        firstName: firstName || phone,
        lastName: '',
        segmentType: SegmentType.LEAD,
      });
      contact = await this.contactRepository.save(contact);
    }
    return contact;
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    const updatedContact = this.contactRepository.merge(contact, updateContactDto);
    return await this.contactRepository.save(updatedContact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
  }
}
