import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'registro_conexiones', schema: 'db_fmc' })
export class RegistroConexione {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column()
    hora:string;

    @Column()
    correo:string;

    @Column()
    rut:string;

    @Column()
    ip:string

    @Column()
    empresa:number;
}
