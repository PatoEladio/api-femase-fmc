import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateAsignacionTurnoRotativoDto {
    @IsNotEmpty()
    @IsNumber()
    empleado_id: number;

    @IsNotEmpty()
    @IsNumber()
    horario_id: number;

    @IsDate()
    @IsOptional()
    fecha_inicio_turno: Date;

    @IsDate()
    @IsOptional()
    fecha_fin_turno: Date;
}
