import { Test, TestingModule } from '@nestjs/testing';
import { AutorizaHorasExtrasController } from './autoriza_horas_extras.controller';
import { AutorizaHorasExtrasService } from './autoriza_horas_extras.service';

describe('AutorizaHorasExtrasController', () => {
  let controller: AutorizaHorasExtrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutorizaHorasExtrasController],
      providers: [AutorizaHorasExtrasService],
    }).compile();

    controller = module.get<AutorizaHorasExtrasController>(AutorizaHorasExtrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
