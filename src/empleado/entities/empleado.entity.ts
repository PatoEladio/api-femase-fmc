import { ApiProperty } from "@nestjs/swagger";
import { Cargo } from "src/cargos/entities/cargo.entity";
import { Cenco } from "src/cencos/cenco.entity";
import { Empresa } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'empleado', schema: 'db_fmc' })
export class Empleado {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identificador del empleado', example: 1 })
  empleado_id: number;

  @Column()
  @ApiProperty({ description: 'RUN del empleado', example: '21223312-2' })
  run: string;

  @Column()
  @ApiProperty({ description: 'Nombres del empleado', example: 'Bastián' })
  nombres: string;

  @Column()
  @ApiProperty({ description: 'Apellido paterno del empleado', example: 'Soto' })
  apellido_paterno: string;

  @Column()
  @ApiProperty({ description: 'Apellido materno del empleado', example: 'Pérez' })
  apellido_materno: string;

  @Column()
  @ApiProperty({ description: 'Fecha de nacimiento del empleado', example: '1990-01-01' })
  fecha_nacimiento: Date;

  @Column()
  @ApiProperty({ description: 'Dirección del empleado', example: 'Av. Principal 123' })
  direccion: string;

  @Column()
  @ApiProperty({ description: 'Correo electrónico del empleado', example: 'usuario@dominio.cl' })
  email: string;

  @Column()
  @ApiProperty({ description: 'Sexo del empleado', example: 'M' })
  sexo: string;

  @Column()
  @ApiProperty({ description: 'Teléfono fijo del empleado', example: 22223333 })
  telefono_fijo: number;

  @Column()
  @ApiProperty({ description: 'Teléfono móvil del empleado', example: 987654321 })
  telefono_movil: number;

  @Column()
  @ApiProperty({ description: 'Comuna de residencia del empleado', example: 'Santiago' })
  comuna: string;

  @Column()
  @ApiProperty({ description: 'Fecha de inicio de contrato', example: '2024-01-01' })
  fecha_ini_contrato: Date;

  @Column()
  @ApiProperty({ description: 'Indica si el contrato es indefinido', example: true })
  contrato_indefinido: boolean;

  @Column()
  @ApiProperty({ description: 'Fecha de término de contrato', example: '2024-12-31' })
  fecha_fin_contrato: Date;

  @Column()
  @ApiProperty({ description: 'Indica si aplica artículo 22', example: false })
  art_22: boolean;

  @Column()
  @ApiProperty({ description: 'Indica si el empleado autoriza ausencia', example: true })
  autoriza_ausencia: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Clave de acceso del empleado', example: '1234' })
  clave: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.empleados)
  @JoinColumn({ name: 'empresa_id' })
  @ApiProperty({ type: () => Empresa, description: "empresa", example: 1 })
  empresa: Empresa;

  // Relaciones (Cargo, Turno)
  @ManyToOne(() => Cargo, (cargo) => cargo.empleados)
  @JoinColumn({ name: 'cargo_id' })
  @ApiProperty({ type: () => Cargo, description: "cargo", example: 1 })
  cargo: Cargo;

  @ManyToOne(() => Turno, (turno) => turno.empleados, { nullable: true })
  @JoinColumn({ name: 'turno_id' })
  @ApiProperty({ type: () => Turno, description: "turno", example: 1 })
  turno: Turno | null;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ type: () => Estado, description: "estado", example: 1 })
  estado: Estado;

  @Column()
  @ApiProperty({ description: 'Correo electrónico laboral del empleado', example: 'usuario@dt.gob.cl' })
  email_laboral: string;

  @Column()
  @ApiProperty({ description: "numero de ficha del empleado", example: "21287800-6B" })
  num_ficha: string;

  @ManyToOne(() => Cenco, (cenco) => cenco.empleados)
  @JoinColumn({ name: 'cenco_id' })
  @ApiProperty({ type: () => Cenco, description: "cenco", example: 1 })
  cenco: Cenco;

}