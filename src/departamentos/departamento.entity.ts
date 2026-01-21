import { ApiProperty } from '@nestjs/swagger';
import { Empresas } from 'src/empresas/empresas.entity';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('db_fmc.departamentos')
export class Departamento {
  @PrimaryGeneratedColumn()
  departamento_id: number;

  @Column()
  @ApiProperty({ description: "nombre_departamento", example: 'I. Santiago' })
  nombre_departamento: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado_id", example: 1 })
  estado: Estado;

  @OneToOne(() => Empresas)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ description: "empresa_id", example: 1 })
  empresa: Empresas;

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
