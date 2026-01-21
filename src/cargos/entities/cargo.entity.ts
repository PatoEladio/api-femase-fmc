import { ApiProperty } from "@nestjs/swagger";
import { Empresas } from "src/empresas/empresas.entity";
import { Estado } from "src/estado/estado.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('db_fmc.cargo')
export class Cargo {
  @PrimaryGeneratedColumn()
  cargo_id: number;

  @Column()
  @ApiProperty({ description: 'nombre', example: 'Desarrollador' })
  nombre: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @OneToOne(() => Empresas)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresas;
}