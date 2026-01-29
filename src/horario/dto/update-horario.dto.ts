import { PartialType } from '@nestjs/swagger';
import { Horario } from '../entities/horario.entity';

export class UpdateHorarioDto extends PartialType(Horario) {}
