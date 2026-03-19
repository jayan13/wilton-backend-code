import { Test, TestingModule } from '@nestjs/testing';
import { SampleRequestController } from './sample-request.controller';
import { SampleRequestService } from './sample-request.service';

describe('SampleRequestController', () => {
  let controller: SampleRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleRequestController],
      providers: [SampleRequestService],
    }).compile();

    controller = module.get<SampleRequestController>(SampleRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
