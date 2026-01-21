import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "src/estado/estado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('db_fmc.tipo_dispositivo')
export class TipoDispositivo {
  @PrimaryGeneratedColumn()
  tipo_dispositivo_id: number;

  @Column()
  @ApiProperty({ description: "nombre_tipo", example: "Reloj Control" })
  nombre_tipo: string;

  @Column()
  @ApiProperty({ description: "descripcion", example: "Reloj para realizar marcacion" })
  descripcion: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

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
}
