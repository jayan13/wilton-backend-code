import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ColorCategory } from '../entities/color-category.entity';

export class ColorCategoryPaginationResponse {
  @IsNumber()
  count: number;

  @IsOptional()
  @Type(() => ColorCategory)
  @IsArray()
  colorCategories: ColorCategory[];
}
