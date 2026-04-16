import { IsIn, IsOptional } from 'class-validator';

export class RangeDto {
  @IsOptional()
  @IsIn(['7', '15', '30'])
  range?: '7' | '15' | '30';
}
