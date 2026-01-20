import { PartialType } from '@nestjs/swagger';
import { TipoDispositivo } from '../entities/tipo-dispositivo.entity';

export class UpdateTipoDispositivoDto extends PartialType(TipoDispositivo) {}
