import { Empleado } from "src/empleado/entities/empleado.entity";
import { Empresa } from "src/empresas/empresas.entity";

export class CreateFirmaDto {
    nombre: string;
    tipo: string;
    texto: string;
    id_empleado: number;
    empresa: number;
    usuario:number
}
