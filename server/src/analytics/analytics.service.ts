import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Contact } from 'src/entitys/contact.entity';
import { Message } from 'src/entitys/message.entity';
import { Task } from 'src/entitys/task.entity';

type Activity = {
  id: string;
  type: 'contact' | 'task' | 'message';
  title: string;
  description: string;
  date: Date;
  initials?: string;
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,

    @InjectRepository(Message)
    private messageRepo: Repository<Message>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  // 🔤 Helper para iniciales
  private getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  }

  // 🔹 helper fechas (CORREGIDO PRO)
  private getDateRange(days: number) {
    const now = new Date();

    const currentFrom = new Date();
    currentFrom.setDate(now.getDate() - days);
    currentFrom.setHours(0, 0, 0, 0);

    const currentTo = new Date();
    currentTo.setHours(23, 59, 59, 999);

    const previousFrom = new Date(currentFrom);
    previousFrom.setDate(previousFrom.getDate() - days);

    const previousTo = new Date(currentFrom.getTime() - 1);

    return {
      current: { from: currentFrom, to: currentTo },
      previous: { from: previousFrom, to: previousTo },
    };
  }

  private calcPercentage(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // 🔥 DASHBOARD
  async getDashboardStats(range: string = '7') {
    const days = Number(range) || 7;
    const { current, previous } = this.getDateRange(days);

    // ✅ CONTACTOS ACTIVOS (TOTAL)
    const totalContacts = await this.contactRepo.count();

    // ✅ CONTACTOS NUEVOS PARA %
    const contactsCurrent = await this.contactRepo.count({
      where: { createdAt: Between(current.from, current.to) },
    });

    const contactsPrevious = await this.contactRepo.count({
      where: { createdAt: Between(previous.from, previous.to) },
    });

    // MENSAJES
    const messagesCurrent = await this.messageRepo.count({
      where: { createdAt: Between(current.from, current.to) },
    });

    const messagesPrevious = await this.messageRepo.count({
      where: { createdAt: Between(previous.from, previous.to) },
    });

    // RESPUESTAS
    const sentCurrent = await this.messageRepo.count({
      where: {
        direction: 'sent',
        createdAt: Between(current.from, current.to),
      },
    });

    const receivedCurrent = await this.messageRepo.count({
      where: {
        direction: 'received',
        createdAt: Between(current.from, current.to),
      },
    });

    const sentPrevious = await this.messageRepo.count({
      where: {
        direction: 'sent',
        createdAt: Between(previous.from, previous.to),
      },
    });

    const receivedPrevious = await this.messageRepo.count({
      where: {
        direction: 'received',
        createdAt: Between(previous.from, previous.to),
      },
    });

    const responseRateCurrent =
      sentCurrent + receivedCurrent
        ? (sentCurrent / (sentCurrent + receivedCurrent)) * 100
        : 0;

    const responseRatePrevious =
      sentPrevious + receivedPrevious
        ? (sentPrevious / (sentPrevious + receivedPrevious)) * 100
        : 0;

    return {
      contacts: {
        value: totalContacts, // 🔥 TOTAL REAL
        change: this.calcPercentage(contactsCurrent, contactsPrevious),
      },
      messages: {
        value: messagesCurrent,
        change: this.calcPercentage(messagesCurrent, messagesPrevious),
      },
      responseRate: {
        value: Math.round(responseRateCurrent),
        change: this.calcPercentage(responseRateCurrent, responseRatePrevious),
      },
    };
  }

  // 📈 MENSAJES EN EL TIEMPO
  async getMessagesOverTime(range: string = '7') {
    const days = Number(range) || 7;
    const { current } = this.getDateRange(days);

    return this.messageRepo
      .createQueryBuilder('message')
      .select('DATE(message.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('message.createdAt BETWEEN :from AND :to', {
        from: current.from,
        to: current.to,
      })
      .groupBy('DATE(message.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  // 🧾 ACTIVIDAD RECIENTE (5)
  async getRecentActivity() {
    const [contacts, tasks, messages] = await Promise.all([
      this.contactRepo.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.taskRepo.find({
        relations: ['contact'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.messageRepo.find({
        relations: ['contact'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    const activity: Activity[] = [
      ...contacts.map((c) => ({
        id: `contact-${c.id}`,
        type: 'contact' as const,
        title: `${c.firstName} ${c.lastName}`,
        initials: this.getInitials(c.firstName, c.lastName),
        description: 'Nuevo contacto agregado',
        date: c.createdAt,
      })),

      ...tasks.map((t) => ({
        id: `task-${t.id}`,
        type: 'task' as const,
        title: t.contact
          ? `${t.contact.firstName} ${t.contact.lastName}`
          : 'Sin contacto',
        initials: t.contact
          ? this.getInitials(t.contact.firstName, t.contact.lastName)
          : '',
        description: t.complete
          ? `Tarea completada: ${t.title}`
          : `Tarea creada: ${t.title}`,
        date: t.createdAt,
      })),

      ...messages.map((m) => ({
        id: `message-${m.id}`,
        type: 'message' as const,
        title: m.contact
          ? `${m.contact.firstName} ${m.contact.lastName}`
          : 'Contacto',
        initials: m.contact
          ? this.getInitials(m.contact.firstName, m.contact.lastName)
          : '',
        description: 'Nuevo mensaje',
        date: m.createdAt,
      })),
    ];

    return activity
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  // 📚 TODA LA ACTIVIDAD
  async getAllActivity() {
    const [contacts, tasks, messages] = await Promise.all([
      this.contactRepo.find(),
      this.taskRepo.find({ relations: ['contact'] }),
      this.messageRepo.find({ relations: ['contact'] }),
    ]);

    const activity: Activity[] = [
      ...contacts.map((c) => ({
        id: `contact-${c.id}`,
        type: 'contact' as const,
        title: `${c.firstName} ${c.lastName}`,
        initials: this.getInitials(c.firstName, c.lastName),
        description: 'Nuevo contacto agregado',
        date: c.createdAt,
      })),

      ...tasks.map((t) => ({
        id: `task-${t.id}`,
        type: 'task' as const,
        title: t.contact
          ? `${t.contact.firstName} ${t.contact.lastName}`
          : 'Sin contacto',
        initials: t.contact
          ? this.getInitials(t.contact.firstName, t.contact.lastName)
          : '',
        description: t.complete
          ? `Tarea completada: ${t.title}`
          : `Tarea creada: ${t.title}`,
        date: t.createdAt,
      })),

      ...messages.map((m) => ({
        id: `message-${m.id}`,
        type: 'message' as const,
        title: m.contact
          ? `${m.contact.firstName} ${m.contact.lastName}`
          : 'Contacto',
        initials: m.contact
          ? this.getInitials(m.contact.firstName, m.contact.lastName)
          : '',
        description: 'Nuevo mensaje',
        date: m.createdAt,
      })),
    ];

    const sorted = activity.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return {
      total: sorted.length,
      data: sorted,
    };
  }
}
