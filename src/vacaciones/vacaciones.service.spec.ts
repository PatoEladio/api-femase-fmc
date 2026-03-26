import { Test, TestingModule } from '@nestjs/testing';
import { VacacionesService } from './vacaciones.service';

describe('VacacionesService', () => {
  let service: VacacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacacionesService],
    }).compile();

    service = module.get<VacacionesService>(VacacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
