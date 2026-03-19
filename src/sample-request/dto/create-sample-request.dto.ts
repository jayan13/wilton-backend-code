import { IsEnum, IsOptional, IsString } from 'class-validator';
import { productConstruction, SampleSize } from './sample-size.type';

export class CreateSampleRequestDto {
  @IsEnum(SampleSize)
  sampleSize: SampleSize;

  @IsString()
  designId: string;

  @IsOptional()
  @IsEnum(productConstruction)
  productConstruction: productConstruction;

  @IsOptional()
  @IsString()
  pileType: string;
}
