import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TurnoHorario } from "./turno-horario.entity";

@Entity('db_fmc.semana')
export class Semana {
  @PrimaryGeneratedColumn()
  cod_dia: number;

  @Column()
  nombre_dia: string;

  @OneToMany(() => TurnoHorario, (turnoHorario) => turnoHorario.semana)
  turnos_asignados: TurnoHorario[];
}
