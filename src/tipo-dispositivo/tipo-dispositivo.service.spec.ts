import { Test, TestingModule } from '@nestjs/testing';
import { TipoDispositivoService } from './tipo-dispositivo.service';

describe('TipoDispositivoService', () => {
  let service: TipoDispositivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoDispositivoService],
    }).compile();

    service = module.get<TipoDispositivoService>(TipoDispositivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
