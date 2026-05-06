import { Test, TestingModule } from '@nestjs/testing';
import { RegistroConexionesController } from './registro_conexiones.controller';
import { RegistroConexionesService } from './registro_conexiones.service';

describe('RegistroConexionesController', () => {
  let controller: RegistroConexionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroConexionesController],
      providers: [RegistroConexionesService],
    }).compile();

    controller = module.get<RegistroConexionesController>(RegistroConexionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
