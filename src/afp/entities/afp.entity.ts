import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'afp', schema: 'db_fmc' })
export class Afp {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Identificador de afp', example: 1 })
    afp_id: number;

    @Column()
    @ApiProperty({ description: 'Nombre de la afp', example: 'AFP Habitat' })
    nombre_afp: string;

    @Column()
    @ApiProperty({ description: 'Estado de la afp', example: 1 })
    estado_id: number;
}
