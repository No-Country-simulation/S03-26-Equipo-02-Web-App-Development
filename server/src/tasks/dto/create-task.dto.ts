import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TaskPriority } from 'src/entitys/enums/task-priority.enum';

export class CreateTaskDto {
  @IsUUID()
  contactId!: string; // Relación con el Contact

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  complete?: boolean;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  expirationDate?: string; // ISO date string
}
