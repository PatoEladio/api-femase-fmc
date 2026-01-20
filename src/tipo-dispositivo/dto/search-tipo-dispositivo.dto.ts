import { TipoDispositivo } from "../entities/tipo-dispositivo.entity";

export class SearchTipoDispositivoDto {
  tipos: TipoDispositivo[];
  mensaje: string;
}
