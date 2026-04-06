import { Test, TestingModule } from '@nestjs/testing';
import { AutorizaHorasExtrasService } from './autoriza_horas_extras.service';

describe('AutorizaHorasExtrasService', () => {
  let service: AutorizaHorasExtrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutorizaHorasExtrasService],
    }).compile();

    service = module.get<AutorizaHorasExtrasService>(AutorizaHorasExtrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
