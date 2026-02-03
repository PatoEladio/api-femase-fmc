import { ApiProperty } from '@nestjs/swagger';
import { Cenco } from 'src/cencos/cenco.entity';
import { Empresa } from 'src/empresas/empresas.entity';
import { Estado } from 'src/estado/estado.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

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

  @ManyToOne(() => Empresa, (empresa) => empresa.departamentos)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ type: () => Empresa, description: 'empresa_id', example: 8 })
  empresa: Empresa;

  @OneToMany(() => Cenco, (cenco) => cenco.departamento)
  cencos: Cenco[];
}