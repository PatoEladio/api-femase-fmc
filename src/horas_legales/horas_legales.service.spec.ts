import { Test, TestingModule } from '@nestjs/testing';
import { HorasLegalesService } from './horas_legales.service';

describe('HorasLegalesService', () => {
  let service: HorasLegalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorasLegalesService],
    }).compile();

    service = module.get<HorasLegalesService>(HorasLegalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
