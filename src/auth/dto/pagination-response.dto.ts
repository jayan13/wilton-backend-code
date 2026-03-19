import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { User } from '../entities';

export class PaginationResponse {
  @IsNumber()
  count: number;

  @IsOptional()
  @Type(() => User)
  @IsArray()
  users: User[];
}
