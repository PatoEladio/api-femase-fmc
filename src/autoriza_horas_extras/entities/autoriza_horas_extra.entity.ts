import { Cargo } from "src/cargos/entities/cargo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'autoriza_horas_extras',schema: 'db_fmc'})
export class AutorizaHorasExtra {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Cargo, (cargo) => cargo.cargo_id)
    @JoinColumn({ name: 'cargo' })
    cargo: Cargo;

    @Column()
    fecha_marca:Date;

    @Column()
    hora_entrada:string;

    @Column()
    hora_salida:string;

    @Column()
    hora_entrada_teorica:string;

    @Column()
    hora_salida_teorica:string;

    @Column()
    duracion_turno:string;
    
    @Column()
    horas_presenciales:string;

    @Column()
    observacion:string;

    @Column()
    horas_extras:string

    @Column()
    estado:string;
}
