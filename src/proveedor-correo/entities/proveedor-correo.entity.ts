import { ApiProperty } from "@nestjs/swagger";
import { Empresa } from "src/empresas/empresas.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'proveedor_correo', schema: 'db_fmc' })
export class ProveedorCorreo {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Identificador de proveedor de correo', example: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: 'Dominio del proveedor de correo', example: 'femase.cl' })
    dominio: string;

    @OneToOne(() => Empresa,(empresa) => empresa.proveedor_correo)
    @JoinColumn({ name: 'empresa_id' })
    @ApiProperty({ type: () => Empresa, description: "empresa", example: 1 })
    empresa: Empresa;
}
