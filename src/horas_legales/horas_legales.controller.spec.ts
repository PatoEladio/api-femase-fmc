import { Test, TestingModule } from '@nestjs/testing';
import { HorasLegalesController } from './horas_legales.controller';
import { HorasLegalesService } from './horas_legales.service';

describe('HorasLegalesController', () => {
  let controller: HorasLegalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorasLegalesController],
      providers: [HorasLegalesService],
    }).compile();

    controller = module.get<HorasLegalesController>(HorasLegalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
