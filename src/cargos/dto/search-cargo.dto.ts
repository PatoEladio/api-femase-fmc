import { Cargo } from "../entities/cargo.entity";

export class SearchCargoDto {
  cargos: Cargo[];
  mensaje: string
}