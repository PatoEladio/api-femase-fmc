import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'proveedor_correo', schema: 'db_fmc' })
export class ProveedorCorreo {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Identificador de proveedor de correo', example: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: 'Nombre del proveedor de correo', example: 'FEMASE' })
    nombre: string;

    @Column()
    @ApiProperty({ description: 'Dominio del proveedor de correo', example: 'femase.cl' })
    dominio: string;
}
