import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { User } from 'src/auth/entities';
import { PaginationParams } from 'src/common';
import { GetCurrentUser } from 'src/common/decorator';
import { JwtAuthGuard } from 'src/common/guards';
import { CompanyColorService } from './company-color.service';
import { CreateCompanyColorDto } from './dto/create-company-color.dto';
import { UpdateCompanyColorDto } from './dto/update-company-color.dto';

@UseGuards(JwtAuthGuard)
@Controller('company-colors')
export class CompanyColorController {
  constructor(private readonly companyColorService: CompanyColorService) {}

  @Post()
  create(
    @GetCurrentUser() user: User,
    @Body() createCompanyColorDto: CreateCompanyColorDto,
  ) {
    return this.companyColorService.create(createCompanyColorDto, user);
  }

  @Get()
  findAll(
    @Query() { offset, limit, colorCategory, isActive }: PaginationParams,
    @Query('q') query: string,
  ) {
    return this.companyColorService.findAll(
      offset,
      limit,
      colorCategory,
      isActive,
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyColorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyColorDto: UpdateCompanyColorDto,
  ) {
    return this.companyColorService.update(id, updateCompanyColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyColorService.remove(id);
  }
}
