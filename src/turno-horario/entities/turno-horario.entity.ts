import { ApiProperty } from "@nestjs/swagger";
import { Turno } from "src/turno/entities/turno.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Semana } from "./semana.entity";

@Entity({ name: 'turno_has_semana', schema: 'db_fmc' })
export class TurnoHorario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Turno, (turno) => turno.dias)
  @JoinColumn({ name: 'turno_id' })
  @ApiProperty({ type: () => Turno, description: "turno_id", example: 1 })
  turno: Turno;

  @ManyToOne(() => Semana, (semana) => semana.turnos_asignados)
  @JoinColumn({ name: 'cod_dia' })
  @ApiProperty({ description: "cod_dia", example: 3 })
  semana: Semana;



}
