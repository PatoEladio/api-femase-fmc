import { Test, TestingModule } from '@nestjs/testing';
import { FirmasService } from './firmas.service';

describe('FirmasService', () => {
  let service: FirmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirmasService],
    }).compile();

    service = module.get<FirmasService>(FirmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
