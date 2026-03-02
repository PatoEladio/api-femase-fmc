import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProveedorCorreoDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'ID del proveedor de correo', example: 1 })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Nombre del proveedor de correo', example: 'FEMASE' })
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Dominio del proveedor de correo', example: 'femase.cl' })
    dominio: string;
}
