import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "src/estado/estado.entity";
import { Marca } from "src/marcas/entities/marca.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo_marcas', { schema: 'db_fmc' })
export class TipoMarca {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: "id", example: 1 })
    tipo_marca_id: number;

    @Column()
    @ApiProperty({ description: "nombre", example: "nombre" })
    nombre: string;

    @OneToOne(() => Estado)
    @JoinColumn({ name: 'estado_id' })
    @ApiProperty({ description: "estado", example: 1 })
    estado_id: Estado;

    @OneToMany(() => Marca, (marca) => marca.tipo_marca)
    marcas: Marca[];
}
