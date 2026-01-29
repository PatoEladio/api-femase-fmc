import { PartialType } from '@nestjs/swagger';
import { CreateTurnoHorarioDto } from './create-turno-horario.dto';
import { TurnoHorario } from '../entities/turno-horario.entity';

export class UpdateTurnoHorarioDto extends PartialType(TurnoHorario) {}
