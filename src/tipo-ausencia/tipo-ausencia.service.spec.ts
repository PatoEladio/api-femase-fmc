import { Test, TestingModule } from '@nestjs/testing';
import { TipoAusenciaService } from './tipo-ausencia.service';

describe('TipoAusenciaService', () => {
  let service: TipoAusenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoAusenciaService],
    }).compile();

    service = module.get<TipoAusenciaService>(TipoAusenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
