import { Test, TestingModule } from '@nestjs/testing';
import { FirmasController } from './firmas.controller';
import { FirmasService } from './firmas.service';

describe('FirmasController', () => {
  let controller: FirmasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmasController],
      providers: [FirmasService],
    }).compile();

    controller = module.get<FirmasController>(FirmasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
