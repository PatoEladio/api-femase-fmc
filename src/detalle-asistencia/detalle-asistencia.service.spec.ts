import { Test, TestingModule } from '@nestjs/testing';
import { DetalleAsistenciaService } from './detalle-asistencia.service';

describe('DetalleAsistenciaService', () => {
  let service: DetalleAsistenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleAsistenciaService],
    }).compile();

    service = module.get<DetalleAsistenciaService>(DetalleAsistenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
