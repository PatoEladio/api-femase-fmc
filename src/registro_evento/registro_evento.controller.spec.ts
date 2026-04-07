import { Test, TestingModule } from '@nestjs/testing';
import { RegistroEventoController } from './registro_evento.controller';
import { RegistroEventoService } from './registro_evento.service';

describe('RegistroEventoController', () => {
  let controller: RegistroEventoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroEventoController],
      providers: [RegistroEventoService],
    }).compile();

    controller = module.get<RegistroEventoController>(RegistroEventoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
