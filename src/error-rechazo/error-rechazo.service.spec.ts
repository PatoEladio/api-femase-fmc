import { Test, TestingModule } from '@nestjs/testing';
import { ErrorRechazoService } from './error-rechazo.service';

describe('ErrorRechazoService', () => {
  let service: ErrorRechazoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorRechazoService],
    }).compile();

    service = module.get<ErrorRechazoService>(ErrorRechazoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
