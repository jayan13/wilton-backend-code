import { Test, TestingModule } from '@nestjs/testing';
import { ColorCategoryService } from './color-category.service';

describe('ColorCategoryService', () => {
  let service: ColorCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorCategoryService],
    }).compile();

    service = module.get<ColorCategoryService>(ColorCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
