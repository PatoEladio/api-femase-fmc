import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "src/estado/estado.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_fmc.tipo_dispositivo')
export class TipoDispositivo {
  @PrimaryGeneratedColumn()
  tipo_dispositivo_id: number;

  @Column()
  @ApiProperty({ description: "nombre_tipo", example: "Reloj Control" })
  nombre_tipo: string;

  @Column()
  @ApiProperty({ description: "descripcion", example: "Reloj para realizar marcacion" })
  descripcion: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;
}
