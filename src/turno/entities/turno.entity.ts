import { ApiProperty } from "@nestjs/swagger";
import { Cenco } from "src/cencos/cenco.entity";
import { DetalleTurno } from "src/detalle-turno/entities/detalle-turno.entity";
import { Empleado } from "src/empleado/entities/empleado.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'turno', schema: 'db_fmc' })
export class Turno {
  @PrimaryGeneratedColumn()
  turno_id: number;

  @Column()
  @ApiProperty({ description: "nombre", example: 'Turno numero 1' })
  nombre: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;


  @ManyToOne(() => Empresa, (empresa) => empresa.turnos)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ type: () => Empresa, description: 'empresa_id', example: 9 })
  empresa: Empresa;

  @ManyToMany(() => Cenco, (cenco) => cenco.turnos)
  cencos: Cenco[];

  @OneToMany(() => Empleado, (empleado) => empleado.turno)
  empleados: Empleado[];

  @OneToMany(() => DetalleTurno, (detalleTurno) => detalleTurno.turno)
  @JoinColumn({ name: 'id_detalle_turno' })
  detalle_turno: DetalleTurno[];

  @CreateDateColumn()
  fecha_creacion: Date;
}
