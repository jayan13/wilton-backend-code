import { IsBoolean, IsString } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  // @MinLength(3)
  name: string;

  @IsBoolean()
  status?: boolean = true;
}
