import { Module } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { TurnoController } from './turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cenco } from 'src/cencos/cenco.entity';
import { Semana } from 'src/semana/entities/semana.entity';
import { Horario } from 'src/horario/entities/horario.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';
import { AuditoriaTurno } from 'src/detalle-turno/entities/auditoria-turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Empleado, Cenco, Semana, Horario, DetalleTurno, AuditoriaTurno])],
  controllers: [TurnoController],
  providers: [TurnoService],
})
export class TurnoModule { }
