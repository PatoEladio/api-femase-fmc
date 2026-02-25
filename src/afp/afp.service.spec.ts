import { Test, TestingModule } from '@nestjs/testing';
import { AfpService } from './afp.service';

describe('AfpService', () => {
  let service: AfpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfpService],
    }).compile();

    service = module.get<AfpService>(AfpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
