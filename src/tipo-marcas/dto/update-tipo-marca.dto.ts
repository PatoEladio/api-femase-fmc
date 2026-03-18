import { PartialType } from '@nestjs/swagger';
import { CreateTipoMarcaDto } from './create-tipo-marca.dto';

export class UpdateTipoMarcaDto extends PartialType(CreateTipoMarcaDto) {}
