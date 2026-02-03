import { ApiProperty } from '@nestjs/swagger';
import { Departamento } from 'src/departamentos/departamento.entity';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { Estado } from 'src/estado/estado.entity';
import { Turno } from 'src/turno/entities/turno.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'cencos', schema: 'db_fmc' })
export class Cenco {
  @PrimaryGeneratedColumn()
  cenco_id: number;

  @Column()
  @ApiProperty({ description: "nombre_cenco", example: "PPF CALAMA" })
  nombre_cenco: string;

  @Column()
  @ApiProperty({ description: "direccion", example: "Calama" })
  direccion: string;

  @Column()
  @ApiProperty({ description: "region", example: "Calama" })
  region: string;

  @Column()
  @ApiProperty({ description: "comuna", example: "Calama" })
  comuna: string;

  @Column()
  @ApiProperty({ description: "email_general", example: "Calama" })
  email_general: string;

  @Column()
  @ApiProperty({ description: "email_notificacions", example: "Calama" })
  email_notificacion: string;

  @Column()
  @ApiProperty({ description: "zona_extrema", example: false })
  zona_extrema: boolean;

  @Column()
  estado_id: number;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @Column()
  departamento_id: number;

  @ManyToOne(() => Departamento, (departamento) => departamento.cencos)
  @JoinColumn({ name: 'departamento_id' })
  @ApiProperty({ description: "departamento_id", example: 10 })
  departamento: Departamento;

  @OneToMany(() => Dispositivo, (dispositivo) => dispositivo.cenco, { cascade: true })
  dispositivos: Dispositivo[];

  @ManyToMany(() => Turno)
  @JoinTable({
    name: 'cenco_has_turnos',
    joinColumn: {
      name: 'cenco_id',
      referencedColumnName: 'cenco_id'
    },
    inverseJoinColumn: {
      name: 'turno_id',
      referencedColumnName: 'turno_id'
    }
  })
  @ApiProperty({ type: () => Turno, description: '' })
  turnos: Turno[];
}
