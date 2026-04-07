import { Test, TestingModule } from '@nestjs/testing';
import { DetalleAsistenciaController } from './detalle-asistencia.controller';
import { DetalleAsistenciaService } from './detalle-asistencia.service';

describe('DetalleAsistenciaController', () => {
  let controller: DetalleAsistenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleAsistenciaController],
      providers: [DetalleAsistenciaService],
    }).compile();

    controller = module.get<DetalleAsistenciaController>(DetalleAsistenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
