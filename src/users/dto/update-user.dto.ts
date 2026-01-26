import { PartialType } from '@nestjs/swagger';
import { User } from '../user.entity';

// Esto hace que todos los campos de Empresas sean opcionales para el Patch
export class UpdateUsuarioDto extends PartialType(User) { }