import { IsOptional, IsNumber, IsUUID } from 'class-validator';

export class orderUpdateDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
