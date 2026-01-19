import { PartialType } from '@nestjs/swagger';
import { Cenco } from '../cenco.entity';

// Esto hace que todos los campos de Empresas sean opcionales para el Patch
export class UpdateCencoDTO extends PartialType(Cenco) { }