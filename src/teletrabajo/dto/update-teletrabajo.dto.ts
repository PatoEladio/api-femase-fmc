import { PartialType } from '@nestjs/swagger';
import { CreateTeletrabajoDto } from './create-teletrabajo.dto';

export class UpdateTeletrabajoDto extends PartialType(CreateTeletrabajoDto) {}
