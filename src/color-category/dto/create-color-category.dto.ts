import { IsBoolean, IsHexColor, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateColorCategoryDto {
  @IsString()
  name: string;

  @IsHexColor()
  colorCode: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}
