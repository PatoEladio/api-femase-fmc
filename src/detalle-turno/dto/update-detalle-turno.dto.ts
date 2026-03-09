import { PartialType } from '@nestjs/swagger';
import { CreateDetalleTurnoDto } from './create-detalle-turno.dto';

export class UpdateDetalleTurnoDto extends PartialType(CreateDetalleTurnoDto) {}
