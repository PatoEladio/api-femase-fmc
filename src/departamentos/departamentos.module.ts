import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './departamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento])],
  providers: [DepartamentosService],
  controllers: [DepartamentosController]
})
export class DepartamentosModule {}
