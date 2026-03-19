import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import DatabaseFilesService from '../auth/databaseFiles.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('database-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class DatabaseFilesController {
  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const file = await this.databaseFilesService.getFileById(id);

    const stream = Readable.from(file.data);
    stream.pipe(response);
  }
}
