import { Dispositivo } from "../entities/dispositivo.entity";

export class SearchDispositivoDto {
  dispositivos: Dispositivo[];
  mensaje: string;
}
