import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from 'src/entitys/contact.entity';
import { Message } from 'src/entitys/message.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,

    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async getDashboardStats() {
    const totalContacts = await this.contactRepo.count();

    const totalMessages = await this.messageRepo.count();

    const respondedMessages = await this.messageRepo.count({
      where: { direction: 'sent' },
    });

    const responseRate = totalMessages
      ? (respondedMessages / totalMessages) * 100
      : 0;

    return {
      totalContacts,
      totalMessages,
      responseRate: Math.round(responseRate),
    };
  }

  async getMessagesOverTime() {
    return this.messageRepo
      .createQueryBuilder('message')
      .select('DATE(message.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(message.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getRecentActivity() {
    return this.messageRepo.find({
      relations: ['contact'],
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }
}
