import { PartialType } from '@nestjs/swagger';
import { CreateSolicitudeDto } from './create-solicitude.dto';

export class UpdateSolicitudeDto extends PartialType(CreateSolicitudeDto) {
    motivo?: string;
    estado?: string;
}
