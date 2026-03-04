import { ApiProperty } from "@nestjs/swagger";
import { Empresa } from "src/empresas/empresas.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'horario', schema: 'db_fmc' })
export class Horario {
  @PrimaryGeneratedColumn()
  horario_id: number;

  @Column({
    type: "time",
    name: "hora_entrada",
    nullable: true
  })
  @ApiProperty({ description: "hora_entrada", example: "09:00:00" })
  hora_entrada: string; // Formato esperado: "14:30:00"

  @Column({
    type: "time",
    name: "hora_salida",
    nullable: true
  })
  @ApiProperty({ description: "hora_salida", example: "13:00:00" })
  hora_salida: string;

  @OneToOne(() => Empresa)
  @ApiProperty({ type: () => Empresa, description: "empresa", example: 1 })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({
    type: "time",
    name: "holgura_mins",
    nullable: true
  })
  @ApiProperty({ description: "holgura_mins", example: "00:40:00" })
  holgura_mins: string;

  @Column({
    type: "time",
    name: "colacion",
    nullable: true
  })
  @ApiProperty({ description: "colacion", example: "00:60:00" })
  colacion: string;
}
