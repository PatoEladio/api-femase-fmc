import { Test, TestingModule } from '@nestjs/testing';
import { MarcasAuditoriaService } from './marcas-auditoria.service';

describe('MarcasAuditoriaService', () => {
  let service: MarcasAuditoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcasAuditoriaService],
    }).compile();

    service = module.get<MarcasAuditoriaService>(MarcasAuditoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
