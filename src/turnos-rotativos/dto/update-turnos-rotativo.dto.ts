import { PartialType } from '@nestjs/swagger';
import { CreateTurnosRotativoDto } from './create-turnos-rotativo.dto';

export class UpdateTurnosRotativoDto extends PartialType(CreateTurnosRotativoDto) {}
