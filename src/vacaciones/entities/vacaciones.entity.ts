import { Empleado } from "src/empleado/entities/empleado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'db_fmc', name: 'vacaciones' })
export class Vacaciones {
  @PrimaryGeneratedColumn()
  id_vacaciones: number;

  @CreateDateColumn()
  fecha_ingreso: Date;

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  dias_acumulados: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  dias_efectivos: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  saldo_vacaciones: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  saldo_vba_previo: number;

  @Column()
  zona_extrema: boolean;

  @Column()
  autorizador: string;

  @Column()
  estado: string;

  @ManyToOne(() => Empleado, (empleado) => empleado.vacaciones)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;
}
