import { Module } from '@nestjs/common';
import { DetalleTurnoService } from './detalle-turno.service';
import { DetalleTurnoController } from './detalle-turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleTurno } from './entities/detalle-turno.entity';
import { AuditoriaTurno } from './entities/auditoria-turno.entity';
import { Horario } from 'src/horario/entities/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleTurno, AuditoriaTurno, Horario])],
  controllers: [DetalleTurnoController],
  providers: [DetalleTurnoService],
})
export class DetalleTurnoModule {}
