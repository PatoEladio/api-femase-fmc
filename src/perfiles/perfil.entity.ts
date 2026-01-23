import { ApiProperty } from '@nestjs/swagger';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('db_fmc.perfil')
export class Perfil {
  @PrimaryGeneratedColumn()
  perfil_id: number;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "Administrador" })
  nombre_perfil: string;

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
