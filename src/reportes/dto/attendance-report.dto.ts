export class AttendanceRecordDto {
  fecha: string;
  entrada: string;
  salida: string;
  entradaTeorica: string;
  salidaTeorica: string;
  horasTeoricas: string;
  horasPresenciales: string;
  atraso: string;
  horasJustificadas: string;
  horasExtra: string;
  horasNoTrabajadas: string;
  totalDia: string;
  observacion: string;
}

export class UserReportDto {
  nombre: string;
  cargo: string;
  rut: string;
  centroCosto: string;
  fechaIngreso: string;
  periodo: { desde: string; hasta: string };
  registros: AttendanceRecordDto[];
}
