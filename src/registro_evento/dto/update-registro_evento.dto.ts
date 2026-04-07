import { PartialType } from '@nestjs/swagger';
import { CreateRegistroEventoDto } from './create-registro_evento.dto';

export class UpdateRegistroEventoDto extends PartialType(CreateRegistroEventoDto) {}
