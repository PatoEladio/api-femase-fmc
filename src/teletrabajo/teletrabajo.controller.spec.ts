import { Test, TestingModule } from '@nestjs/testing';
import { TeletrabajoController } from './teletrabajo.controller';
import { TeletrabajoService } from './teletrabajo.service';

describe('TeletrabajoController', () => {
  let controller: TeletrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeletrabajoController],
      providers: [TeletrabajoService],
    }).compile();

    controller = module.get<TeletrabajoController>(TeletrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
