import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
} from 'class-validator';
import { ColorCategory } from 'src/color-category/entities/color-category.entity';

export class CreateCompanyColorDto {
  @IsString()
  // @MinLength(3)
  name: string;

  @IsHexColor()
  colorCode: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsArray()
  colorCategories?: ColorCategory[];

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
