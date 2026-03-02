import { Test, TestingModule } from '@nestjs/testing';
import { TipoAusenciaController } from './tipo-ausencia.controller';
import { TipoAusenciaService } from './tipo-ausencia.service';

describe('TipoAusenciaController', () => {
  let controller: TipoAusenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoAusenciaController],
      providers: [TipoAusenciaService],
    }).compile();

    controller = module.get<TipoAusenciaController>(TipoAusenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
