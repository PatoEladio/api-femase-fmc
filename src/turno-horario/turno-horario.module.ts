import { Module } from '@nestjs/common';
import { TurnoHorarioService } from './turno-horario.service';
import { TurnoHorarioController } from './turno-horario.controller';

@Module({
  controllers: [TurnoHorarioController],
  providers: [TurnoHorarioService],
})
export class TurnoHorarioModule {}
