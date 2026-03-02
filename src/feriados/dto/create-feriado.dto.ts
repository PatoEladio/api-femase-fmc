import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateFeriadoDto {
    @IsString()
    fecha: string;

    @IsString()
    tipo_feriado: string;

    @IsString()
    nombre: string;

    @IsString()
    observacion: string;

    @IsBoolean()
    irrenunciable: boolean;

    @IsString()
    tipo: string;

    @IsString()
    respaldo_legal: string;

    @IsString()
    region: string;

    @IsString()
    comuna: string;
}
