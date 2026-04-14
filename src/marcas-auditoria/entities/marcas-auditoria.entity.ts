import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Marca } from "src/marcas/entities/marca.entity";
import { Estado } from "src/estado/estado.entity";

@Entity({ schema: 'db_fmc', name: 'marcas_auditoria' })
export class MarcasAuditoria {
  @PrimaryGeneratedColumn()
  correlativo: number;

  @Column()
  id_marca: number;

  @OneToOne(() => Marca)
  @JoinColumn({ name: 'id_marca' })
  marca: Marca;

  @Column()
  fecha_marca: Date;

  @Column()
  hora_marca: string;

  @Column()
  evento: number;

  @Column()
  hashcode: string;

  @Column()
  num_ficha: string;

  @Column()
  fecha_actualizacion: Date;

  @Column()
  usuario_actualizador: string;

  @Column()
  token: string;

  @Column({ nullable: true })
  id_tipo_marca: number;

  @Column({ nullable: true })
  info_adicional: string;

  @Column({ nullable: true })
  comentario: string;

  @Column({ name: 'estado_id', default: 3 })
  estado_id: number;

  @Column('json', { nullable: true })
  datos_update: any;
}
