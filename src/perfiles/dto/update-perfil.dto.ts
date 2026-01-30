import { PartialType } from '@nestjs/swagger';
import { Perfil } from '../perfil.entity';

// Esto hace que todos los campos de Empresa sean opcionales para el Patch
export class UpdatePerfilDto extends PartialType(Perfil) { }