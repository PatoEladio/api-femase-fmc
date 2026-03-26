import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { MarcasAuditoria } from 'src/marcas-auditoria/entities/marcas-auditoria.entity';
import { Feriado } from '../feriados/entities/feriado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marca, MarcasAuditoria, Feriado])],
  controllers: [MarcasController],
  providers: [MarcasService],
  exports: [MarcasService]
})
export class MarcasModule { }
