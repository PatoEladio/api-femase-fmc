import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorCorreoService } from './proveedor-correo.service';

describe('ProveedorCorreoService', () => {
  let service: ProveedorCorreoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProveedorCorreoService],
    }).compile();

    service = module.get<ProveedorCorreoService>(ProveedorCorreoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
