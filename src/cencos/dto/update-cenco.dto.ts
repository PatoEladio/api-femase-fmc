import { PartialType } from '@nestjs/swagger';
import { Cenco } from '../cenco.entity';
import { CreateCencoDto } from './create-cenco.dto';

// Esto hace que todos los campos de Empresa sean opcionales para el Patch
export class UpdateCencoDTO extends PartialType(CreateCencoDto) { }