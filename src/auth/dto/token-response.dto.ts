import { IsString } from 'class-validator';

export class ResponseTokenDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;
}
