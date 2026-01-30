import { PartialType } from '@nestjs/swagger';
import { Departamento } from '../departamento.entity';

// Esto hace que todos los campos de Empresa sean opcionales para el Patch
export class UpdateDepartamentoDto extends PartialType(Departamento) { }