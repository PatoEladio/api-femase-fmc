import { Empleado } from "src/empleado/entities/empleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'alertas', schema: 'db_fmc' })
export class Alerta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tipo: number;

    @ManyToOne(() => Empleado, (empleado) => empleado.alertas)
    @JoinColumn({ name: 'id_empleado' })
    empleado: Empleado;

    @Column()
    fecha: Date;
}
