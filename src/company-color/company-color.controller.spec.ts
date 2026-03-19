import { Test, TestingModule } from '@nestjs/testing';
import { CompanyColorController } from './company-color.controller';
import { CompanyColorService } from './company-color.service';

describe('CompanyColorController', () => {
  let controller: CompanyColorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyColorController],
      providers: [CompanyColorService],
    }).compile();

    controller = module.get<CompanyColorController>(CompanyColorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
