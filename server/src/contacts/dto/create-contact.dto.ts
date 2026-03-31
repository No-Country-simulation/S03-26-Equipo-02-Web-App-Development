import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SegmentType } from 'src/entitys/enums/segment-type.enum';
//import { SegmentType } from '../entitys/enums/segment-type.enum';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(SegmentType)
  @IsOptional()
  segmentType?: SegmentType;
}
