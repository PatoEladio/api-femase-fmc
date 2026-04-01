import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { MarcasModule } from '../marcas/marcas.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';
import { Feriado } from '../feriados/entities/feriado.entity';
import { Vacaciones } from 'src/vacaciones/entities/vacaciones.entity';

@Module({
  imports: [MarcasModule, EmpleadoModule, TypeOrmModule.forFeature([Empleado, Feriado, Vacaciones])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule { }
