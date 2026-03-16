import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionTurnoRotativoController } from './asignacion_turno_rotativo.controller';
import { AsignacionTurnoRotativoService } from './asignacion_turno_rotativo.service';

describe('AsignacionTurnoRotativoController', () => {
  let controller: AsignacionTurnoRotativoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionTurnoRotativoController],
      providers: [AsignacionTurnoRotativoService],
    }).compile();

    controller = module.get<AsignacionTurnoRotativoController>(AsignacionTurnoRotativoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
