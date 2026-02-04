import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Cenco } from 'src/cencos/cenco.entity';
import { Empresa } from 'src/empresas/empresas.entity';
import { Estado } from 'src/estado/estado.entity';
import { Perfil } from 'src/perfiles/perfil.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'usuario', schema: 'db_fmc' })
export class User {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column()
  @ApiProperty({ description: "username", example: "bcarrion" })
  username: string;

  @Column()
  @Exclude()
  @ApiProperty({ description: "password", example: "123" })
  password: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @Column()
  @ApiProperty({ description: "nombres", example: "Bastián Maximiliano" })
  nombres: string;

  @Column()
  @ApiProperty({ description: "apellido_paterno", example: "Carrión" })
  apellido_paterno: string;

  @Column()
  @ApiProperty({ description: "apellido_materno", example: "Sandoval" })
  apellido_materno: string;

  @Column()
  @ApiProperty({ description: "email", example: "bcarrion@femase.cl" })
  email: string;

  @OneToOne(() => Perfil)
  @ApiProperty({ description: "perfil", example: 1 })
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;

  @Column()
  @ApiProperty({ description: "run_usuario", example: "21264235-5" })
  run_usuario: string;

  @OneToOne(() => Empresa)
  @ApiProperty({ type: () => Empresa, description: "empresa", example: 1 })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'reset_token'
  })
  reset_token: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'reset_token_expires'
  })
  reset_token_expires: Date | null;

  @ManyToMany(() => Cenco, (cenco) => cenco.usuarios)
  @JoinTable({
    name: 'usuario_has_cenco',
    joinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'usuario_id'
    },
    inverseJoinColumn: {
      name: 'cenco_id',
      referencedColumnName: 'cenco_id'
    }
  })
  cencos: Cenco[];
}
