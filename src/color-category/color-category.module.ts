import { Module } from '@nestjs/common';
import { ColorCategoryService } from './color-category.service';
import { ColorCategoryController } from './color-category.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorCategory } from './entities/color-category.entity';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    TypeOrmModule.forFeature([ColorCategory]),
  ],
  controllers: [ColorCategoryController],
  providers: [ColorCategoryService],
})
export class ColorCategoryModule {}
