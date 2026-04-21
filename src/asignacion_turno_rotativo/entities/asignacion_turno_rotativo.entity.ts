import { Empleado } from "src/empleado/entities/empleado.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'asignacion_turno_rotativo', schema: 'db_fmc' })
export class AsignacionTurnoRotativo {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Empleado, (empleado) => empleado.asignacion_turno_rotativo)
    @JoinColumn({ name: 'empleado_id' })
    empleado: Empleado

    @ManyToOne(() => Horario, (horario) => horario.asignacion_turno_rotativo)
    @JoinColumn({ name: 'horario_id' })
    horario: Horario;

    @Column()
    fecha_inicio_turno:Date

    @Column()
    fecha_fin_turno:Date

    @Column({default:false})
    teletrabajo:boolean
}
