import { Module } from '@nestjs/common';
import { CompanyColorService } from './company-color.service';
import { CompanyColorController } from './company-color.controller';
import { CompanyColor } from './entities/company-color.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorCategoryService } from 'src/color-category/color-category.service';
import { ColorCategory } from 'src/color-category/entities/color-category.entity';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    TypeOrmModule.forFeature([CompanyColor, ColorCategory]),
  ],
  controllers: [CompanyColorController],
  providers: [CompanyColorService, ColorCategoryService],
})
export class CompanyColorModule {}
