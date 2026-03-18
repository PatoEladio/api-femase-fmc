import { Test, TestingModule } from '@nestjs/testing';
import { DetalleTurnoService } from './detalle-turno.service';

describe('DetalleTurnoService', () => {
  let service: DetalleTurnoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleTurnoService],
    }).compile();

    service = module.get<DetalleTurnoService>(DetalleTurnoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
