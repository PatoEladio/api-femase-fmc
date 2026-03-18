import { Horario } from "src/horario/entities/horario.entity";
import { Semana } from "src/semana/entities/semana.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'detalle_turno', schema: 'db_fmc' })
export class DetalleTurno {

    @PrimaryGeneratedColumn()
    id_detalle_turno: number;

    @ManyToOne(() => Turno, (turno) => turno.detalle_turno)
    @JoinColumn({ name: 'id_turno' })
    turno: Turno;

    @ManyToOne(() => Horario, (horario) => horario.detalle_turno)
    @JoinColumn({ name: 'id_horario' })
    horario: Horario;

    @ManyToOne(() => Semana, (semana) => semana.detalle_turno)
    @JoinColumn({ name: 'id_dia' })
    dia: Semana;


}
