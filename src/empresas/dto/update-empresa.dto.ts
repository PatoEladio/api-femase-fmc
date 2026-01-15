import { PartialType } from '@nestjs/swagger';
import { Empresas } from '../empresas.entity';

// Esto hace que todos los campos de Empresas sean opcionales para el Patch
export class UpdateEmpresaDto extends PartialType(Empresas) { }