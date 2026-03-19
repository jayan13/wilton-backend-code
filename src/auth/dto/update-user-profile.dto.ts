import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  password?: string;

  @IsOptional()
  // @IsUrl()
  logo?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email: string;

  // @IsOptional()
  // @IsUrl()
  // data: Uint8Array;
}
