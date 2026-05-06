import { Test, TestingModule } from '@nestjs/testing';
import { RegistroConexionesService } from './registro_conexiones.service';

describe('RegistroConexionesService', () => {
  let service: RegistroConexionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistroConexionesService],
    }).compile();

    service = module.get<RegistroConexionesService>(RegistroConexionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
