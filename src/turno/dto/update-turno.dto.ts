import { PartialType } from '@nestjs/swagger';
import { CreateTurnoDto } from './create-turno.dto';
import { Turno } from '../entities/turno.entity';

export class UpdateTurnoDto extends PartialType(Turno) {}
