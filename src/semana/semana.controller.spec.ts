import { Test, TestingModule } from '@nestjs/testing';
import { SemanaController } from './semana.controller';
import { SemanaService } from './semana.service';

describe('SemanaController', () => {
  let controller: SemanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemanaController],
      providers: [SemanaService],
    }).compile();

    controller = module.get<SemanaController>(SemanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
