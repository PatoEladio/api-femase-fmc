import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("sesion_activa", { schema: 'db_fmc' })
export class SesionActiva {

    @PrimaryGeneratedColumn()
    sesion_id:number

    @ManyToOne(() => User, (user) => user.sesionActivas)
    @JoinColumn({ name: 'usuario_id' })
    user:User

    @Column()
    ip:string

    @Column()
    navegador:string

    @Column()
    sistema_operativo:string

    @Column()
    fecha_conexion:Date
}
