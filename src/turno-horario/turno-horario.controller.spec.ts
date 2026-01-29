import { Test, TestingModule } from '@nestjs/testing';
import { TurnoHorarioController } from './turno-horario.controller';
import { TurnoHorarioService } from './turno-horario.service';

describe('TurnoHorarioController', () => {
  let controller: TurnoHorarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnoHorarioController],
      providers: [TurnoHorarioService],
    }).compile();

    controller = module.get<TurnoHorarioController>(TurnoHorarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
