import { Empresas } from "src/empresas/empresas.entity";

export class CreateUserDto {
  usuario_id: number;
  usuario: string;
  empresa: Empresas[];
  mensaje: string;
}