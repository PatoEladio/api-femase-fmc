import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "src/estado/estado.entity";
import { TipoDispositivo } from "src/tipo-dispositivo/entities/tipo-dispositivo.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_fmc.dispositivo')
export class Dispositivo {
  @PrimaryGeneratedColumn()
  dispositivo_id: number;

  @Column()
  @ApiProperty({ description: 'fecha_ingreso', example: '2025-01-12 00:00:00' })
  fecha_ingreso: string;

  @Column()
  @ApiProperty({ description: 'fecha_actualizacion', example: '2025-01-14 05:00:00' })
  fecha_actualizacion: string;

  @Column()
  @ApiProperty({ description: 'ubicacion', example: 'La Rioja 2956 - Entrada B' })
  ubicacion: string;

  @Column()
  @ApiProperty({ description: 'comuna', example: 'Quinta Normal' })
  comuna: string;

  @Column()
  @ApiProperty({ description: 'modelo', example: 'FEMASE-CONTROL' })
  modelo: string;

  @Column()
  @ApiProperty({ description: 'fabricante', example: 'FEMASE' })
  fabricante: string;

  @Column()
  @ApiProperty({ description: 'version_firmware', example: '2.0.0.0' })
  version_firmware: string;

  @Column()
  @ApiProperty({ description: 'direccion_ip', example: '10.14.0.12' })
  direccion_ip: string;

  @Column()
  @ApiProperty({ description: 'gateway', example: '0.0.0.0' })
  gateway: string;

  @Column()
  @ApiProperty({ description: 'dns', example: 'femase.cl' })
  dns: string;

  // FALTAN LLAVES FORANEAS
  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => TipoDispositivo)
  @JoinColumn({ name: 'tipo_dispositivo_id' })
  @ApiProperty({ description: "tipo_dispositivo", example: 1 })
  tipo_dispositivo: TipoDispositivo;

  @Column()
  @ApiProperty({ description: 'nombre', example: 'ADMINISTRACION_CENTRAL' })
  nombre: string;
}
