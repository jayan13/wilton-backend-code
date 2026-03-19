import {
  IsString,
  MinLength,
  Matches,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Library } from '../../library/entities/library.entity';
import { UserRole } from '../auth.type';

export class CreateUserDto {
  @IsString()
  // @MinLength(3)
  fullName: string;

  @IsString()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'email is invalid' },
  )
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsNotEmpty() // comment while creating a first user
  // @IsOptional() // uncomment while creating first user
  @IsArray()
  libraries: Library[];

  @IsOptional()
  @IsEnum(UserRole)
  @IsString()
  role: UserRole;
}
