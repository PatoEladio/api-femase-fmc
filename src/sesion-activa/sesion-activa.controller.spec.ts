import { Test, TestingModule } from '@nestjs/testing';
import { SesionActivaController } from './sesion-activa.controller';
import { SesionActivaService } from './sesion-activa.service';

describe('SesionActivaController', () => {
  let controller: SesionActivaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SesionActivaController],
      providers: [SesionActivaService],
    }).compile();

    controller = module.get<SesionActivaController>(SesionActivaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
