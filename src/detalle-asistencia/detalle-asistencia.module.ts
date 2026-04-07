import { Module, forwardRef } from '@nestjs/common';
import { DetalleAsistenciaService } from './detalle-asistencia.service';
import { DetalleAsistenciaController } from './detalle-asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleAsistencia } from './entities/detalle-asistencia.entity';
import { MarcasModule } from '../marcas/marcas.module';
import { Empleado } from '../empleado/entities/empleado.entity';
import { Feriado } from '../feriados/entities/feriado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleAsistencia, Empleado, Feriado]),
    forwardRef(() => MarcasModule),
  ],
  controllers: [DetalleAsistenciaController],
  providers: [DetalleAsistenciaService],
  exports: [DetalleAsistenciaService]
})
export class DetalleAsistenciaModule { }
