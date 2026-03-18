import { Test, TestingModule } from '@nestjs/testing';
import { SesionActivaService } from './sesion-activa.service';

describe('SesionActivaService', () => {
  let service: SesionActivaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SesionActivaService],
    }).compile();

    service = module.get<SesionActivaService>(SesionActivaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
