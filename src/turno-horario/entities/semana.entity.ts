import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TurnoHorario } from "./turno-horario.entity";

@Entity({ name: 'semana', schema: 'db_fmc' })
export class Semana {
  @PrimaryGeneratedColumn()
  cod_dia: number;

  @Column()
  nombre_dia: string;

  @OneToMany(() => TurnoHorario, (turnoHorario) => turnoHorario.semana)
  turnos_asignados: TurnoHorario[];
}
