import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('db_fmc.estado')
export class Estado {
  @PrimaryGeneratedColumn()
  estado_id: number;

  @Column()
  nombre_estado: string;
}
