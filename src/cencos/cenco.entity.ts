import { ApiProperty } from '@nestjs/swagger';
import { Departamento } from 'src/departamentos/departamento.entity';
import { Empresas } from 'src/empresas/empresas.entity';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

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
  @ApiProperty({ description: "telefono", example: "Calama" })
  telefono: number;

  @Column()
  @ApiProperty({ description: "email_general", example: "Calama" })
  email_general: string;

  @Column()
  @ApiProperty({ description: "email_notificacions", example: "Calama" })
  email_notificacion: string;

  @Column()
  @ApiProperty({ description: "zona_extrema", example: "Calama" })
  zona_extrema: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Empresas)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ description: "empresa_id", example: 1 })
  empresa_id: Empresas;

  @OneToOne(() => Departamento)
  @JoinColumn({ name: 'depto_id' })
  @ApiProperty({ description: "depto_id", example: 1 })
  depto_id: Departamento;
}
