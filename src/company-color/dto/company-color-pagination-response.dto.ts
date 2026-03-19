import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CompanyColor } from '../entities/company-color.entity';

export class CompanyColorPaginationResponse {
  @IsNumber()
  count: number;

  @IsOptional()
  @Type(() => CompanyColor)
  @IsArray()
  companyColors: CompanyColor[];
}
