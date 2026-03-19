import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Library } from '../entities/library.entity';

export class LibraryPaginationResponse {
  @IsNumber()
  count: number;

  @IsOptional()
  @Type(() => Library)
  @IsArray()
  libraries: Library[];
}
