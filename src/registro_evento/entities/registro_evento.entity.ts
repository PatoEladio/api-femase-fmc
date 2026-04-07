import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'registro_evento', schema:'db_fmc' })
export class RegistroEvento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario: string;

    @Column()
    evento: string;

    @Column()
    ip: string;

    @Column()
    tipo_evento: string;

    @Column()
    hora: string;

    @Column()
    sistema_operativo: string;

    @Column()
    browser: string;

    @Column()
    empresa: number;

    @Column()
    depto: number;

    @Column()
    cenco: number;

    @Column()
    rut: string;

    @Column()
    fecha: Date;
}
