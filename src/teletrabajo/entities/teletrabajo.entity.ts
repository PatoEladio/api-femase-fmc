import { Empleado } from "src/empleado/entities/empleado.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'teletrabajo', schema: 'db_fmc'})
export class Teletrabajo {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Empleado, (empleado) => empleado.teletrabajo)
    @JoinColumn({name: 'id_empleado'})
    id_empleado: Empleado

    @Column()
    fecha_actual:Date;

    @ManyToOne(() => Horario, (horario) => horario.teletrabajo)
    @JoinColumn({name: 'id_horario'})
    horario_id: Horario;
}
