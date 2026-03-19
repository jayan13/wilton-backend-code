import { IsArray, IsOptional, IsString } from 'class-validator';
import { Library } from 'src/library/entities/library.entity';

export class CreateDesignDto {
  @IsString()
  // @MinLength(3)
  title: string;

  @IsArray()
  colors: string[];

  @IsString()
  patternImage: string;

  @IsString()
  @IsOptional()
  designNumber: string;

  @IsString()
  @IsOptional()
  productConstruction: string;

  @IsString()
  @IsOptional()
  picksMtr: string;

  @IsString()
  @IsOptional()
  pileType: string;

  @IsString()
  @IsOptional()
  repeatSize: string;

  @IsOptional()
  @IsArray()
  libraries?: Library[];
}
