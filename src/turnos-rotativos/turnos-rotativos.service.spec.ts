import { Test, TestingModule } from '@nestjs/testing';
import { TurnosRotativosService } from './turnos-rotativos.service';

describe('TurnosRotativosService', () => {
  let service: TurnosRotativosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TurnosRotativosService],
    }).compile();

    service = module.get<TurnosRotativosService>(TurnosRotativosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
