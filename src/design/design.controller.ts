import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { PaginationParams } from 'src/common';
import { GetCurrentUser } from 'src/common/decorator';
import { JwtAuthGuard } from 'src/common/guards';
// import { Repository } from 'typeorm';
import { DesignService } from './design.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { Design } from './entities/design.entity';
import { ShareDesignDto } from './dto/share-design.dto';

@UseGuards(JwtAuthGuard)
@Controller('designs')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Post()
  create(
    @GetCurrentUser() user: User,
    @Body() createDesignDto: CreateDesignDto,
  ) {
    console.log('createDesignDto ', createDesignDto);
    return this.designService.create(createDesignDto, user);
  }

  @Post('/share-design')
  shareDesign(
    @Body() shareDesignDto: ShareDesignDto,
    @GetCurrentUser() user: User,
  ) {
    return this.designService.shareDesign(shareDesignDto, user);
  }

  @Get()
  async findAll(
    @Query() { offset, limit, libraries }: PaginationParams,
    @Query('q') query: string,
  ) {
    return this.designService.findAll(offset, limit, libraries, query);
  }

  @Get('/my-design/:userId')
  findAllDesignsForUser(
    @Param('userId') id: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    return this.designService.findAllDesignsForUser(id, offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesignDto: UpdateDesignDto,
  ): Promise<Design> {
    return this.designService.update(id, updateDesignDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Design> {
    return this.designService.delete(id);
  }
}
