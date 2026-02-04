import { ApiProperty } from "@nestjs/swagger";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('db_fmc.cargo')
export class Cargo {
  @PrimaryGeneratedColumn()
  cargo_id: number;

  @Column()
  @ApiProperty({ description: 'nombre', example: 'Desarrollador' })
  nombre: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Empresa)
  @ApiProperty({ type: () => Empresa, description: "empresa", example: 1 })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

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