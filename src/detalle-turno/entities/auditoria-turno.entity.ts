import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'auditoria_turno', schema: 'db_fmc' })
export class AuditoriaTurno {
    @PrimaryGeneratedColumn()
    auditoria_id: number;

    @Column({ type: 'time', nullable: true })
    hora_entrada: string | null;

    @Column({ type: 'time', nullable: true })
    hora_salida: string | null;

    @Column({ type: 'varchar', nullable: true })
    extension_turno: string | null;

    @Column({ type: 'timestamp', nullable: true })
    fecha_asignacion_turno: Date | null;

    @Column({ type: 'date', nullable: true })
    inicio_turno: Date | null;

    @Column({ type: 'time', nullable: true })
    nuevo_hora_entrada: string | null;

    @Column({ type: 'time', nullable: true })
    nuevo_hora_salida: string | null;

    @Column({ type: 'varchar', nullable: true })
    extension_nuevo_turno: string | null;

    @Column({ type: 'varchar', nullable: true })
    solicitador_cambio: string | null;

    @Column({ type: 'varchar', nullable: true })
    observaciones: string | null;

    @Column({ type: 'varchar', nullable: true })
    run_empleado: string | null;
}
