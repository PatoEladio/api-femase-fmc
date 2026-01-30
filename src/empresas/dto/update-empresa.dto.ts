import { PartialType } from '@nestjs/swagger';
import { Empresa } from '../empresas.entity';

// Esto hace que todos los campos de Empresa sean opcionales para el Patch
export class UpdateEmpresaDto extends PartialType(Empresa) { }