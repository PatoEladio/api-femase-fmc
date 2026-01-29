import { ApiProperty } from "@nestjs/swagger";
import { Empresas } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Column()
  usuario_creador: string;

  @CreateDateColumn({
    type: 'timestamp', // O 'date' según prefieras
    default: () => 'CURRENT_TIMESTAMP'
  })
  fecha_creacion: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true
  })
  fecha_actualizacion: Date;

  @OneToOne(() => Empresas)
  @ApiProperty({ description: "empresa", example: 1 })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresas;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Horario)
  @JoinColumn({ name: 'horario_id' })
  @ApiProperty({ description: "horario_id", example: 1 })
  horario: Horario;
}
