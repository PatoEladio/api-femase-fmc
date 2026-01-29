import { ApiProperty } from "@nestjs/swagger";
import { Empresas } from "src/empresas/empresas.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_fmc.horario')
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

  @OneToOne(() => Empresas)
  @ApiProperty({ description: "empresa", example: 1 })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresas;
}
