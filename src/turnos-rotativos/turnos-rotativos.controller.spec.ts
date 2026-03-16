import { Test, TestingModule } from '@nestjs/testing';
import { TurnosRotativosController } from './turnos-rotativos.controller';
import { TurnosRotativosService } from './turnos-rotativos.service';

describe('TurnosRotativosController', () => {
  let controller: TurnosRotativosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnosRotativosController],
      providers: [TurnosRotativosService],
    }).compile();

    controller = module.get<TurnosRotativosController>(TurnosRotativosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
