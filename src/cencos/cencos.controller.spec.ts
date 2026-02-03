import { Test, TestingModule } from '@nestjs/testing';
import { CencosController } from './cencos.controller';

describe('CencosController', () => {
  let controller: CencosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CencosController],
    }).compile();

    controller = module.get<CencosController>(CencosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});