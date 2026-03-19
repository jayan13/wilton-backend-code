import { Test, TestingModule } from '@nestjs/testing';
import { CompanyColorService } from './company-color.service';

describe('CompanyColorService', () => {
  let service: CompanyColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyColorService],
    }).compile();

    service = module.get<CompanyColorService>(CompanyColorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
