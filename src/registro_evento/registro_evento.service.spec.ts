import { Test, TestingModule } from '@nestjs/testing';
import { RegistroEventoService } from './registro_evento.service';

describe('RegistroEventoService', () => {
  let service: RegistroEventoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistroEventoService],
    }).compile();

    service = module.get<RegistroEventoService>(RegistroEventoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
