import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('db_fmc.perfil')
export class Perfil {
  @PrimaryGeneratedColumn()
  perfil_id: number;

  @Column()
  nombre_perfil: string;

  @OneToOne(() => Estado, estado => estado.estado_id)
  estado_id: Estado;
}
