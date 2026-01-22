import { ApiProperty } from '@nestjs/swagger';
import { Departamento } from 'src/departamentos/departamento.entity';
import { Empresas } from 'src/empresas/empresas.entity';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('db_fmc.cencos')
export class Cenco {
  @PrimaryGeneratedColumn()
  cenco_id: number;

  @Column()
  @ApiProperty({ description: "nombre_cenco", example: "PPF CALAMA" })
  nombre_cenco: string;

  @Column()
  @ApiProperty({ description: "direccion", example: "Calama" })
  direccion: string;

  @Column()
  @ApiProperty({ description: "region", example: "Calama" })
  region: string;

  @Column()
  @ApiProperty({ description: "comuna", example: "Calama" })
  comuna: string;

  @Column()
  @ApiProperty({ description: "email_general", example: "Calama" })
  email_general: string;

  @Column()
  @ApiProperty({ description: "email_notificacions", example: "Calama" })
  email_notificacion: string;

  @Column()
  @ApiProperty({ description: "zona_extrema", example: false })
  zona_extrema: boolean;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Departamento)
  @JoinColumn({ name: 'depto_id' })
  @ApiProperty({ description: "depto_id", example: 1 })
  depto: Departamento;

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

  @Column()
  @ApiProperty({ description: "telefono", example: "921772304" })
  telefono: string;
}
