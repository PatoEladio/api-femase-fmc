import { PartialType } from '@nestjs/swagger';
import { CreateDetalleAsistenciaDto } from './create-detalle-asistencia.dto';

export class UpdateDetalleAsistenciaDto extends PartialType(CreateDetalleAsistenciaDto) {}
