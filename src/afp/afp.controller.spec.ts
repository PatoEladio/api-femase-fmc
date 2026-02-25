import { Test, TestingModule } from '@nestjs/testing';
import { AfpController } from './afp.controller';
import { AfpService } from './afp.service';

describe('AfpController', () => {
  let controller: AfpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfpController],
      providers: [AfpService],
    }).compile();

    controller = module.get<AfpController>(AfpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
