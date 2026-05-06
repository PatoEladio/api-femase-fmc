import { PartialType } from '@nestjs/swagger';
import { CreateRegistroConexioneDto } from './create-registro_conexione.dto';

export class UpdateRegistroConexioneDto extends PartialType(CreateRegistroConexioneDto) {}
