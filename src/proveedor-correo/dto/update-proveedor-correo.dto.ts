import { PartialType } from '@nestjs/swagger';
import { CreateProveedorCorreoDto } from './create-proveedor-correo.dto';

export class UpdateProveedorCorreoDto extends PartialType(CreateProveedorCorreoDto) {}
