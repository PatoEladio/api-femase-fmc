import { ApiProperty } from "@nestjs/swagger";
import { AutorizaHorasExtra } from "src/autoriza_horas_extras/entities/autoriza_horas_extra.entity";
import { Empleado } from "src/empleado/entities/empleado.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'cargo', schema: 'db_fmc' })
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
    type: 'timestamp',
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

  @OneToMany(() => Empleado, (empleado) => empleado.cargo)
  empleados: Empleado[];

  @Column()
  @ApiProperty({ description: "tipo_cargo", example: 1 })
  tipo_cargo: number

}