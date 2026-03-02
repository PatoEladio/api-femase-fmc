import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorCorreoController } from './proveedor-correo.controller';
import { ProveedorCorreoService } from './proveedor-correo.service';

describe('ProveedorCorreoController', () => {
  let controller: ProveedorCorreoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedorCorreoController],
      providers: [ProveedorCorreoService],
    }).compile();

    controller = module.get<ProveedorCorreoController>(ProveedorCorreoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
