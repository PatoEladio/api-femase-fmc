import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empleado } from '../../empleado/entities/empleado.entity';

@Entity({ name: 'detalle_asistencia', schema: 'db_fmc' })
export class DetalleAsistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  num_ficha: string;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'num_ficha', referencedColumnName: 'num_ficha' })
  empleado: Empleado;

  @Column({ type: 'date', nullable: true })
  fecha_marca: Date;

  @Column({ type: 'varchar', length: 15, nullable: true })
  hora_entrada: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  hora_salida: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  entrada_teorica: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  salida_teorica: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_teoricas: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_presenciales: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_atraso: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_justificadas: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_extras: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  horas_no_trabajadas: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  total_dia: string;

  @Column({ type: 'text', nullable: true })
  observacion: string;
}
