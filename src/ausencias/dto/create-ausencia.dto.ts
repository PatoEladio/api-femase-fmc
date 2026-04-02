export class CreateAusenciaDto {
    num_ficha: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    hora_inicio: string;
    hora_fin: string;
    dia_completo: boolean;
    motivo_ausencia: number;
}
