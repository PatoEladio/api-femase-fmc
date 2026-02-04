import { ApiProperty } from "@nestjs/swagger";
import { Cenco } from "src/cencos/cenco.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("db_fmc.turno")
export class Turno {
  @PrimaryGeneratedColumn()
  turno_id: number;

  @Column()
  @ApiProperty({ description: "nombre", example: 'Turno numero 1' })
  nombre: string;

  @Column()
  @ApiProperty({ description: "es_rotativo", example: false })
  es_rotativo: boolean;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Horario)
  @JoinColumn({ name: 'horario_id' })
  @ApiProperty({ description: "horario_id", example: 1 })
  horario: Horario;

  @ManyToOne(() => Empresa, (empresa) => empresa.turnos)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ type: () => Empresa, description: 'empresa_id', example: 9 })
  empresa: Empresa;

  @ManyToMany(() => Cenco, (cenco) => cenco.turnos)
  cencos: Cenco[];

}
