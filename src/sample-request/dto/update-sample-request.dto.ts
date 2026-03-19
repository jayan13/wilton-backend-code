import { PartialType } from '@nestjs/mapped-types';
import { CreateSampleRequestDto } from './create-sample-request.dto';

export class UpdateSampleRequestDto extends PartialType(
  CreateSampleRequestDto,
) {}
