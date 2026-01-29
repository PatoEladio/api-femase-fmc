import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_fmc.semana')
export class Semana {
  @PrimaryGeneratedColumn()
  cod_dia: number;

  @Column()
  nombre_dia: string;
}
