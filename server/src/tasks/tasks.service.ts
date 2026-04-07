import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from 'src/entitys/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/entitys/contact.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const contact = await this.contactRepository.findOne({
      where: { id: createTaskDto.contactId },
    });
    if (!contact) {
      throw new NotFoundException(
        `Contact with ID ${createTaskDto.contactId} not found`,
      );
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      contact,
    });

    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({ relations: ['contact'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['contact'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.contactId) {
      const contact = await this.contactRepository.findOne({
        where: { id: updateTaskDto.contactId },
      });
      if (!contact) {
        throw new NotFoundException(
          `Contact with ID ${updateTaskDto.contactId} not found`,
        );
      }
      task.contact = contact;
    }

    const updateTask = this.taskRepository.merge(task, updateTaskDto);
    return await this.taskRepository.save(updateTask);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
