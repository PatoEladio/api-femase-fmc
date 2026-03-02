import { PartialType } from '@nestjs/swagger';
import { CreateSesionActivaDto } from './create-sesion-activa.dto';

export class UpdateSesionActivaDto extends PartialType(CreateSesionActivaDto) {}
