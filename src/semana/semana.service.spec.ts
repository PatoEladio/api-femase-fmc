import { Test, TestingModule } from '@nestjs/testing';
import { SemanaService } from './semana.service';

describe('SemanaService', () => {
  let service: SemanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemanaService],
    }).compile();

    service = module.get<SemanaService>(SemanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
