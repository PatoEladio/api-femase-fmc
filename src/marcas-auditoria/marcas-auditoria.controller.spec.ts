import { Test, TestingModule } from '@nestjs/testing';
import { MarcasAuditoriaController } from './marcas-auditoria.controller';
import { MarcasAuditoriaService } from './marcas-auditoria.service';

describe('MarcasAuditoriaController', () => {
  let controller: MarcasAuditoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcasAuditoriaController],
      providers: [MarcasAuditoriaService],
    }).compile();

    controller = module.get<MarcasAuditoriaController>(MarcasAuditoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
