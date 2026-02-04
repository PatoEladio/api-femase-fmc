import { ApiProperty } from "@nestjs/swagger";
import { Empresa } from "src/empresas/empresas.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'empleado', schema: 'db_fmc' })
export class Empleado {
  @PrimaryGeneratedColumn()
  empleado_id: number;

  @Column()
  @ApiProperty({})
  nombres: string;

  @Column()
  @ApiProperty({})
  ape_paterno: string;

  @Column()
  @ApiProperty({})
  ape_materno: string;

  @Column()
  @ApiProperty({})
  fecha_nacimiento: Date;

  @Column()
  @ApiProperty({})
  direccion: string;

  @Column()
  @ApiProperty({})
  email: string;

  @Column()
  @ApiProperty({})
  email_personal: string;

  @Column()
  @ApiProperty({})
  sexo: string;

  @Column()
  @ApiProperty({})
  telefono_fijo: number;

  @Column()
  @ApiProperty({})
  telefono_movil: number;

  @Column()
  @ApiProperty({})
  comuna: string;

  @Column()
  @ApiProperty({})
  fecha_ini_contrato: Date;

  @Column()
  @ApiProperty({})
  fecha_fin_contato: Date;

  @Column()
  @ApiProperty({})
  contrato_indefinido: boolean;

  @Column()
  @ApiProperty({})
  art_22: boolean;

  @Column()
  @ApiProperty({})
  autoriza_ausencia: boolean;

  @Column()
  @ApiProperty({})
  clave: string;

  @ManyToOne(() => Empresa)
  empresa: Empresa;

  // @ManyToMany() -- esto es para manejar los cencos del empleado, solo debe tener uno pero debe ir en la tabla asociativa de usuarios y cencos
}