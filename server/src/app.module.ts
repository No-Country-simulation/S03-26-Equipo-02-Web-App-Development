import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';
import { Contact } from './entitys/contact.entity';
import { Message } from './entitys/message.entity';
import { Tag } from './entitys/tag.entity';
import { Task } from './entitys/task.entity';
import { Analytics } from './entitys/analytics.entity';
import { Channel } from './entitys/channel.entity';
import { Template } from './entitys/template.entity';
import { Redis } from 'ioredis';
import { TasksModule } from './tasks/tasks.module';
import { TwilioModule } from './twilio/twilio.module';
import { BullModule } from '@nestjs/bullmq';
import { BrevoModule } from './brevo/brevo.module';
import { NotesModule } from './notes/notes.module';
import { Note } from './entitys/note.entity';
import { MessagesModule } from './messages/messages.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // ─── Config global ───────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ContactsModule,

    // ─── PostgreSQL ───────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [
          Contact,
          Message,
          Tag,
          Task,
          Note,
          Analytics,
          Channel,
          Template,
        ],
        synchronize: true, // Cambiado a true temporalmente para desarrollo si es necesario, o mantener false si ya hay migraciones
        logging: false,
      }),
    }),
    TasksModule,
    NotesModule,
    TwilioModule,
    BrevoModule,
    MessagesModule,

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
          username: config.get<string>('REDIS_USERNAME', 'default'),
          tls: config.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
        },
      }),
    }),
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // ─── Redis (ioredis) ──────────────────────────────────────────────────────
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
          username: config.get<string>('REDIS_USERNAME', 'default'),
          tls: config.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
          lazyConnect: true,
        });

        client.on('error', (err) => {
          console.error('[Redis] Error de conexión:', err.message);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class AppModule {}
