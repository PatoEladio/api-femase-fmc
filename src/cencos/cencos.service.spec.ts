import { Test, TestingModule } from '@nestjs/testing';
import { CencosService } from './cencos.service';

describe('CencosService', () => {
  let service: CencosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CencosService],
    }).compile();

    service = module.get<CencosService>(CencosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
