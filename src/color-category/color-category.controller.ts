import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ColorCategoryService } from './color-category.service';
import { CreateColorCategoryDto } from './dto/create-color-category.dto';
import { UpdateColorCategoryDto } from './dto/update-color-category.dto';
import { orderUpdateDto } from './dto/order-update.dto';
import { PaginationParams } from 'src/common';
import { User } from 'src/auth/entities';
import { GetCurrentUser } from 'src/common/decorator';
import { JwtAuthGuard } from 'src/common/guards';

@UseGuards(JwtAuthGuard)
@Controller('color-category')
export class ColorCategoryController {
  constructor(private readonly colorCategoryService: ColorCategoryService) {}

  @Post()
  create(
    @Body() createColorCategoryDto: CreateColorCategoryDto,
    @GetCurrentUser() user: User,
  ) {
    return this.colorCategoryService.create(createColorCategoryDto, user);
  }

  @Get()
  findAll(@Query() { offset, limit, isActive }: PaginationParams) {
    return this.colorCategoryService.findAll(offset, limit, isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorCategoryService.findOne(id);
  }
  @Patch('update-order')
  updateOrder(@Body() updateOrderDto: orderUpdateDto[]) {
    return this.colorCategoryService.updateOrder(updateOrderDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColorCategoryDto: UpdateColorCategoryDto,
  ) {
    return this.colorCategoryService.update(id, updateColorCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorCategoryService.remove(id);
  }
}
