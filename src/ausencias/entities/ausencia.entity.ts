import { Empleado } from "src/empleado/entities/empleado.entity";
import { TipoAusencia } from "src/tipo-ausencia/entities/tipo-ausencia.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ausencias', schema: 'db_fmc' })
export class Ausencia {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Empleado, (empleado) => empleado.ausencias)
    @JoinColumn({ name: 'num_ficha', referencedColumnName: 'num_ficha' })
    num_ficha: Empleado;

    @Column()
    fecha_inicio: Date

    @Column()
    fecha_fin: Date

    @Column()
    hora_inicio: string

    @Column()
    hora_fin: string

    @Column()
    dia_completo: boolean

    @ManyToOne(() => TipoAusencia, (tipoAusencia) => tipoAusencia.ausencias)
    @JoinColumn({ name: 'motivo_ausencia' })
    tipo_ausencia: TipoAusencia;
}
