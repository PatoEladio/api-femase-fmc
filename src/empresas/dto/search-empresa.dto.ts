import { Empresa } from "../empresas.entity";

export class BuscarEmpresaDto {
  empresas: Empresa[];
  mensaje: string;
}