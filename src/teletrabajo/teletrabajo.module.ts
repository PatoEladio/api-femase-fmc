import { Module } from '@nestjs/common';
import { TeletrabajoService } from './teletrabajo.service';
import { TeletrabajoController } from './teletrabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teletrabajo } from './entities/teletrabajo.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Horario } from 'src/horario/entities/horario.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';
import { AsignacionTurnoRotativo } from 'src/asignacion_turno_rotativo/entities/asignacion_turno_rotativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teletrabajo, Empleado, Horario, DetalleTurno, AsignacionTurnoRotativo])],
  controllers: [TeletrabajoController],
  providers: [TeletrabajoService],
})
export class TeletrabajoModule {}
