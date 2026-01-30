import { PartialType } from '@nestjs/swagger';
import { User } from '../user.entity';

// Esto hace que todos los campos de Empresa sean opcionales para el Patch
export class UpdateUsuarioDto extends PartialType(User) { }