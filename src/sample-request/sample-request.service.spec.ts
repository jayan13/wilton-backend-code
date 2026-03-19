import { Test, TestingModule } from '@nestjs/testing';
import { SampleRequestService } from './sample-request.service';

describe('SampleRequestService', () => {
  let service: SampleRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SampleRequestService],
    }).compile();

    service = module.get<SampleRequestService>(SampleRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
