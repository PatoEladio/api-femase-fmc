import { Empleado } from "src/empleado/entities/empleado.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'solicitud', schema:'db_fmc'})
export class Solicitude {
    @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        tipo: string;
    
        @Column({ type: 'text' })
        texto: string;
   
    
        @Column()
        estado: string
    
        @ManyToOne(() => Empleado, (empleado) => empleado.solicitudes)
        @JoinColumn({ name: 'empleado_id' })
        empleado: Empleado;
    
        @ManyToOne(() => User, (usuario) => usuario.solicitudes)
        @JoinColumn({ name: 'id_usuario_empleador'})
        usuario: User;
    
        @Column({ type: 'text', nullable: true })
        motivo: string;

        @Column()
        fecha: Date;
        
        @Column()
        hora: string;
}
