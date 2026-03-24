import { Module } from '@nestjs/common';
import { MarcasAuditoriaService } from './marcas-auditoria.service';
import { MarcasAuditoriaController } from './marcas-auditoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasAuditoria } from './entities/marcas-auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarcasAuditoria])],
  controllers: [MarcasAuditoriaController],
  providers: [MarcasAuditoriaService],
})
export class MarcasAuditoriaModule { }
