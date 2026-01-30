import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresasController],
  providers: [EmpresasService]
})
export class EmpresasModule { }
