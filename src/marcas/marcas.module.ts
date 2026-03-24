import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { MarcasAuditoria } from 'src/marcas-auditoria/entities/marcas-auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marca, MarcasAuditoria])],
  controllers: [MarcasController],
  providers: [MarcasService],
})
export class MarcasModule { }
