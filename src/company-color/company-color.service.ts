import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { CompanyColorPaginationResponse } from './dto/company-color-pagination-response.dto';
import { CreateCompanyColorDto } from './dto/create-company-color.dto';
import { UpdateCompanyColorDto } from './dto/update-company-color.dto';
import { CompanyColor } from './entities/company-color.entity';
import { ColorCategoryService } from 'src/color-category/color-category.service';

@Injectable()
export class CompanyColorService {
  constructor(
    @InjectRepository(CompanyColor)
    private companyColorRepository: Repository<CompanyColor>,
    private colorCategoryService: ColorCategoryService,
  ) {}

  async create(
    createCompanyColorDto: CreateCompanyColorDto,
    user: User,
  ): Promise<CompanyColor> {
    console.log(createCompanyColorDto, user);
    try {
      const { colorCategories } = createCompanyColorDto;
      // find all color categories for color.
      let colorCategoryList = [];
      if (colorCategories && colorCategories.length > 0) {
        colorCategoryList =
          await this.colorCategoryService.getAllColorCategories(
            colorCategories,
          );
      }
      const companyColor = await this.companyColorRepository.save({
        name: createCompanyColorDto.name,
        colorCode: createCompanyColorDto.colorCode,
        code: createCompanyColorDto.code,
        colorCategories: colorCategoryList,
        createdBy: user,
        status: createCompanyColorDto.status,
      });
      return companyColor;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating companyColor`,
      );
    }
  }

  async findAll(
    offset: number,
    limit: number,
    colorCategory: string | undefined,
    isActive: string,
    q: string,
  ): Promise<CompanyColorPaginationResponse> {
    const skip = offset > 1 ? (offset - 1) * limit : 0;
    try {
      const query = {};
      if (colorCategory) {
        query['colorCategories'] = { id: colorCategory };
      }
      if (isActive) {
        query['status'] = isActive;
      }
      if (q) {
        query['name'] = ILike(`%${q}%`);
      }

      const [companyColors, count] =
        await this.companyColorRepository.findAndCount({
          where: { ...query },
          order: {
            createAt: 'DESC',
          },
          skip: skip,
          take: limit,
          select: [
            'name',
            'colorCode',
            'code',
            'status',
            'createAt',
            'updatedAt',
            'id',
          ],
          relations: ['colorCategories'],
        });
      return { companyColors, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findOne(id: string) {
    const color = await this.companyColorRepository.findOne({
      where: { id },
      relations: ['colorCategories'],
    });
    if (!color) {
      // TODO: make this return not found in api response
      throw new EntityNotFoundError(CompanyColor, `Color not found`);
    }
    return color;
  }

  async update(
    id: string,
    updateCompanyColorDto: UpdateCompanyColorDto,
  ): Promise<CompanyColor> {
    try {
      const { colorCategories } = updateCompanyColorDto;
      if (colorCategories && colorCategories.length) {
        const colorCategoryList =
          await this.colorCategoryService.getAllColorCategories(
            colorCategories,
          );
        updateCompanyColorDto.colorCategories = colorCategoryList;
      }

      const companyColor = await this.companyColorRepository.save({
        id,
        ...updateCompanyColorDto,
      });
      return companyColor;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating companyColor`,
      );
    }
  }

  async remove(id: string) {
    const color = await this.companyColorRepository.findOne({
      where: { id },
    });
    if (!color) {
      // TODO: make this return not found in api response
      throw new EntityNotFoundError(CompanyColor, `Color not found`);
    }
    return this.companyColorRepository.remove(color);
  }
}
