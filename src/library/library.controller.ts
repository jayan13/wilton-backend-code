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
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { User } from 'src/auth/entities';
import { GetCurrentUser } from 'src/common/decorator';
import { JwtAuthGuard } from 'src/common/guards';
import { PaginationParams } from 'src/common';

@UseGuards(JwtAuthGuard)
@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  create(
    @GetCurrentUser() user: User,
    @Body() createLibraryDto: CreateLibraryDto,
  ) {
    return this.libraryService.create(createLibraryDto, user);
  }

  @Get()
  findAll(@Query() { offset, limit }: PaginationParams) {
    return this.libraryService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.update(id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(id);
  }
}
