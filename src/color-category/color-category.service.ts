import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateColorCategoryDto } from './dto/create-color-category.dto';
import { UpdateColorCategoryDto } from './dto/update-color-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorCategory } from './entities/color-category.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { ColorCategoryPaginationResponse } from './dto/color-category-pagination-response.dto';
import { User } from 'src/auth/entities';
import { orderUpdateDto } from './dto/order-update.dto';

@Injectable()
export class ColorCategoryService {
  constructor(
    @InjectRepository(ColorCategory)
    private colorCategoryRepository: Repository<ColorCategory>,
  ) {}

  async create(
    createColorCategoryDto: CreateColorCategoryDto,
    user: User,
  ): Promise<ColorCategory> {
    try {
      const colorCategory = await this.colorCategoryRepository.save({
        name: createColorCategoryDto.name,
        colorCode: createColorCategoryDto.colorCode,
        createdBy: user,
        status: createColorCategoryDto.status,
        order: createColorCategoryDto.order,
      });
      return colorCategory;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating Color Category`,
      );
    }
  }

  async findAll(
    offset: number,
    limit: number,
    isActive: string,
  ): Promise<ColorCategoryPaginationResponse> {
    const skip = offset > 1 ? (offset - 1) * limit : 0;
    try {
      const query = {};
      if (isActive) {
        query['status'] = isActive;
      }
      const [colorCategories, count] =
        await this.colorCategoryRepository.findAndCount({
          where: { ...query },
          order: {
            order: 'ASC',
          },
          skip: skip,
          take: limit,
          select: [
            'name',
            'colorCode',
            'status',
            'createAt',
            'updatedAt',
            'id',
            'order',
          ],
        });
      return { colorCategories, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findOne(id: string) {
    const colorCategory = await this.colorCategoryRepository.findOne({
      where: { id },
    });
    if (!colorCategory) {
      throw new EntityNotFoundError(ColorCategory, `Color Category not found`);
    }
    return colorCategory;
  }

  async update(
    id: string,
    updateColorCategoryDto: UpdateColorCategoryDto,
  ): Promise<ColorCategory> {
    try {
      const colorCategory = await this.colorCategoryRepository.save({
        id,
        ...updateColorCategoryDto,
      });
      return colorCategory;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while updating color category`,
      );
    }
  }

  async remove(id: string) {
    const color = await this.colorCategoryRepository.findOne({
      where: { id },
    });
    if (!color) {
      throw new EntityNotFoundError(ColorCategory, `Color Category not found`);
    }
    return this.colorCategoryRepository.remove(color);
  }

  async getAllColorCategories(ids: ColorCategory[]) {
    const colorCategories = await this.colorCategoryRepository.find({
      where: { id: In(ids) },
      order: {
        createAt: 'DESC',
      },
    });
    return colorCategories;
  }

  async updateOrder(updateOrderDto: orderUpdateDto[]) {
    try {
      const updatePromises = updateOrderDto.map(async (item) => {
        const colorCategory = await this.colorCategoryRepository.findOne({
          where: { id: item.id },
        });
        if (!colorCategory) {
          throw new EntityNotFoundError(
            ColorCategory,
            `Color Category not found`,
          );
        }
        colorCategory.order = item.order;
        return this.colorCategoryRepository.save(colorCategory);
      });
      await Promise.all(updatePromises);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while updating color category order`,
      );
    }
  }
}
