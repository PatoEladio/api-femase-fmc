import { Test, TestingModule } from '@nestjs/testing';
import { TipoDispositivoController } from './tipo-dispositivo.controller';
import { TipoDispositivoService } from './tipo-dispositivo.service';

describe('TipoDispositivoController', () => {
  let controller: TipoDispositivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoDispositivoController],
      providers: [TipoDispositivoService],
    }).compile();

    controller = module.get<TipoDispositivoController>(TipoDispositivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
