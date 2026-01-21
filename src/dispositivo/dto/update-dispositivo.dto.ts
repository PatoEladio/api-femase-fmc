import { PartialType } from '@nestjs/swagger';
import { Dispositivo } from '../entities/dispositivo.entity';

export class UpdateDispositivoDto extends PartialType(Dispositivo) {}
