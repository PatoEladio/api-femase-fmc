import { Test, TestingModule } from '@nestjs/testing';
import { TipoMarcasService } from './tipo-marcas.service';

describe('TipoMarcasService', () => {
  let service: TipoMarcasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoMarcasService],
    }).compile();

    service = module.get<TipoMarcasService>(TipoMarcasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
