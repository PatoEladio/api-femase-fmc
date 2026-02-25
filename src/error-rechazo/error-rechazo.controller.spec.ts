import { Test, TestingModule } from '@nestjs/testing';
import { ErrorRechazoController } from './error-rechazo.controller';
import { ErrorRechazoService } from './error-rechazo.service';

describe('ErrorRechazoController', () => {
  let controller: ErrorRechazoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorRechazoController],
      providers: [ErrorRechazoService],
    }).compile();

    controller = module.get<ErrorRechazoController>(ErrorRechazoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
