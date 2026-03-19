import { PartialType } from '@nestjs/mapped-types';
import { CreateColorCategoryDto } from './create-color-category.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateColorCategoryDto extends PartialType(
  CreateColorCategoryDto,
) {
  @IsOptional()
  @IsNumber()
  order?: number;
}
