import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'estado', schema: 'db_fmc' })
export class Estado {
  @PrimaryGeneratedColumn()
  estado_id: number;

  @Column()
  nombre_estado: string;
}
