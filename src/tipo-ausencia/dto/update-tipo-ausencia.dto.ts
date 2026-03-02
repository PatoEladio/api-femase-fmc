import { PartialType } from '@nestjs/swagger';
import { CreateTipoAusenciaDto } from './create-tipo-ausencia.dto';

export class UpdateTipoAusenciaDto extends PartialType(CreateTipoAusenciaDto) {}
