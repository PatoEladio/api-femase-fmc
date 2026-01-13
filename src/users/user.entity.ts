import { Exclude } from 'class-transformer';
import { Estado } from 'src/estado/estado.entity';
import { Perfil } from 'src/users/perfil.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('db_fmc.usuario')
export class User {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @Column()
  nombres: string;

  @Column()
  apellido_paterno: string;

  @Column()
  apellido_materno: string;

  @Column()
  email: string;

  @OneToOne(() => Perfil)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
