import { ApiProperty } from '@nestjs/swagger';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('db_fmc.empresa')
export class Empresas {
  @PrimaryGeneratedColumn()
  empresa_id: number;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "FEMASE" })
  nombre_empresa: string;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "77982123-4" })
  rut_empresa: string;
  
  @Column()
  @ApiProperty({ description: "direccion_empresa", example: "Calle de prueba 2311" })
  direccion_empresa: string;
  
  @OneToOne(() => Estado, estado => estado.estado_id)
  @ApiProperty({ description: "estado", example: 1 })
  estado_id: Estado;
}