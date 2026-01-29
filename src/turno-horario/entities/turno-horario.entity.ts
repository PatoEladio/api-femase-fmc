import { ApiProperty } from "@nestjs/swagger";
import { Turno } from "src/turno/entities/turno.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Semana } from "./semana.entity";

@Entity('db_fmc.turno_has_semana')
export class TurnoHorario {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Turno)
  @JoinColumn({ name: 'turno_id' })
  @ApiProperty({ description: "turno_id", example: 1 })
  turno: Turno;

  @OneToOne(() => Semana)
  @JoinColumn({ name: 'cod_dia' })
  @ApiProperty({ description: "cod_dia", example: 3 })
  semana: Semana;
}
