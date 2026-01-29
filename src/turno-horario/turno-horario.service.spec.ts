import { Test, TestingModule } from '@nestjs/testing';
import { TurnoHorarioService } from './turno-horario.service';

describe('TurnoHorarioService', () => {
  let service: TurnoHorarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TurnoHorarioService],
    }).compile();

    service = module.get<TurnoHorarioService>(TurnoHorarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
