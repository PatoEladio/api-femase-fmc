import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionTurnoRotativoService } from './asignacion_turno_rotativo.service';

describe('AsignacionTurnoRotativoService', () => {
  let service: AsignacionTurnoRotativoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionTurnoRotativoService],
    }).compile();

    service = module.get<AsignacionTurnoRotativoService>(AsignacionTurnoRotativoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
