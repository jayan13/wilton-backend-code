import { HttpStatus } from '@nestjs/common';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ResponseStatus } from 'src/auth/auth.type';

export class ResponseDto {
  @IsEnum(ResponseStatus)
  status: ResponseStatus;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(HttpStatus)
  code?: HttpStatus;
}
