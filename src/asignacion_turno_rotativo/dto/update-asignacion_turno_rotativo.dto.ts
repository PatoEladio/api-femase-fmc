import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionTurnoRotativoDto } from './create-asignacion_turno_rotativo.dto';

export class UpdateAsignacionTurnoRotativoDto extends PartialType(CreateAsignacionTurnoRotativoDto) {}
