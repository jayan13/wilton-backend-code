import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyColorDto } from './create-company-color.dto';

export class UpdateCompanyColorDto extends PartialType(CreateCompanyColorDto) {}
