import { ApiProperty } from "@nestjs/swagger";
import { DetalleTurno } from "src/detalle-turno/entities/detalle-turno.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'semana', schema: 'db_fmc' })
export class Semana {

    @PrimaryGeneratedColumn()
    cod_dia: number

    @Column()
    @ApiProperty({ description: "dia", example: 'Lunes' })
    nombre_dia: string;

    @OneToMany(() => DetalleTurno, (detalleTurno) => detalleTurno.dia)
    detalle_turno: DetalleTurno[];
}
