import { IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  role: string;
}
