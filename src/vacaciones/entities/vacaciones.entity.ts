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

  @Column()
  dias_acumulados: number;

  @Column()
  dias_efectivos: number;

  @Column()
  saldo_vacaciones: number;

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
