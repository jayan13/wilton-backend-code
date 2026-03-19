import { Test, TestingModule } from '@nestjs/testing';
import { ColorCategoryController } from './color-category.controller';
import { ColorCategoryService } from './color-category.service';

describe('ColorCategoryController', () => {
  let controller: ColorCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorCategoryController],
      providers: [ColorCategoryService],
    }).compile();

    controller = module.get<ColorCategoryController>(ColorCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
