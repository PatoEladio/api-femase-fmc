import { ApiProperty } from "@nestjs/swagger";
import { AsignacionTurnoRotativo } from "src/asignacion_turno_rotativo/entities/asignacion_turno_rotativo.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'turno_rotativo', schema: 'db_fmc' })
export class TurnosRotativo {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Empresa, (empresa) => empresa.turnos_rotativos)
    @JoinColumn({ name: 'empresa_id' })
    empresa: Empresa;

    @Column()
    @ApiProperty({ description: "nombre ", example: "Turno 1" })
    nombre: string;


    @Column()
    @ApiProperty({ description: "nocturno ", example: "true" })
    nocturno: boolean;

    @OneToOne(() => Estado, (estado) => estado.estado_id)
    @JoinColumn({ name: 'estado' })
    estado: Estado;

    @OneToMany(() => AsignacionTurnoRotativo, (asignacion_turno_rotativo) => asignacion_turno_rotativo.turnoRotativo)
    asignacion_turno_rotativo: AsignacionTurnoRotativo[];
}
