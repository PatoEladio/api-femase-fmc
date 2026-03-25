import { PartialType } from '@nestjs/swagger';
import { CreateMarcasAuditoriaDto } from './create-marcas-auditoria.dto';

export class UpdateMarcasAuditoriaDto extends PartialType(CreateMarcasAuditoriaDto) {}
