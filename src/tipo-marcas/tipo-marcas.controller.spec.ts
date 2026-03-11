import { Test, TestingModule } from '@nestjs/testing';
import { TipoMarcasController } from './tipo-marcas.controller';
import { TipoMarcasService } from './tipo-marcas.service';

describe('TipoMarcasController', () => {
  let controller: TipoMarcasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoMarcasController],
      providers: [TipoMarcasService],
    }).compile();

    controller = module.get<TipoMarcasController>(TipoMarcasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
