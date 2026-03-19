import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { AuthDto } from './auth.dto';

export class ChangePasswordDto extends PickType(AuthDto, [
  'password',
] as const) {
  @IsString()
  resetPasswordToken: string;
}
