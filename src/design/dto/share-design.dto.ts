import { IsString } from 'class-validator';

export class ShareDesignDto {
  @IsString()
  email: string;

  @IsString()
  base64Image: string;
}
