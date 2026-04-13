import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsUUID()
  contactId!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
