import { Dispositivo } from "src/dispositivo/entities/dispositivo.entity";
import { Empleado } from "src/empleado/entities/empleado.entity";
import { MarcasAuditoria } from "src/marcas-auditoria/entities/marcas-auditoria.entity";
import { TipoMarca } from "src/tipo-marcas/entities/tipo-marca.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'marcas', schema: 'db_fmc' })
export class Marca {
  @PrimaryGeneratedColumn()
  id_marca: number;

  @Column()
  fecha_marca: Date;

  @Column()
  hora_marca: string;

  @Column()
  evento: number;

  @Column()
  hashcode: string;

  @Column()
  info_adicional: string;

  @Column()
  id_tipo_marca: number;

  @ManyToOne(() => TipoMarca, (tipoMarca) => tipoMarca.marcas)
  @JoinColumn({ name: 'id_tipo_marca' })
  tipo_marca: TipoMarca;

  @Column()
  dispositivo_id: number;

  @ManyToOne(() => Dispositivo, (dispositivo) => dispositivo.marcas)
  @JoinColumn({ name: 'dispositivo_id' })
  dispositivo: Dispositivo;

  @Column()
  num_ficha: string;

  @ManyToOne(() => Empleado, (empleado) => empleado.marcas)
  @JoinColumn({ name: 'num_ficha', referencedColumnName: 'num_ficha' })
  empleado: Empleado;

  @Column()
  comentario: string;

  @OneToOne(() => MarcasAuditoria, (marcasAuditoria) => marcasAuditoria.id_marca)
  marcas_auditoria: MarcasAuditoria;
}
