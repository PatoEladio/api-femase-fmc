import { PartialType } from '@nestjs/swagger';
import { CreateAlertaDto } from './create-alerta.dto';

export class UpdateAlertaDto extends PartialType(CreateAlertaDto) {}
