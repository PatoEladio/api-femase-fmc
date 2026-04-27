import { Test, TestingModule } from '@nestjs/testing';
import { TeletrabajoService } from './teletrabajo.service';

describe('TeletrabajoService', () => {
  let service: TeletrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeletrabajoService],
    }).compile();

    service = module.get<TeletrabajoService>(TeletrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
