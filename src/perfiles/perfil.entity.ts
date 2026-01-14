import { ApiProperty } from '@nestjs/swagger';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('db_fmc.perfil')
export class Perfil {
  @PrimaryGeneratedColumn()
  perfil_id: number;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "Administrador" })
  nombre_perfil: string;

  @OneToOne(() => Estado, estado => estado.estado_id)
  @ApiProperty({ description: "estado", example: 1 })
  estado_id: Estado;
}
