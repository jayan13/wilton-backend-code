import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Design } from '../entities/design.entity';

export class DesignPaginationResponse {
  @IsNumber()
  count: number;

  @IsOptional()
  @Type(() => Design)
  @IsArray()
  designs: Design[];
}
