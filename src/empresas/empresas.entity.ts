import { ApiProperty } from '@nestjs/swagger';
import { Estado } from 'src/estado/estado.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('db_fmc.empresa')
export class Empresas {
  @PrimaryGeneratedColumn()
  empresa_id: number;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "FEMASE" })
  nombre_empresa: string;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "77982123-4" })
  rut_empresa: string;

  @Column()
  @ApiProperty({ description: "direccion_empresa", example: "Calle de prueba 2311" })
  direccion_empresa: string;

  @Column()
  @ApiProperty({ description: "comuna_empresa", example: "Quinta Normal" })
  comuna_empresa: string;

  @Column()
  @ApiProperty({ description: "email_empresa", example: "soporte@femase.cl" })
  email_empresa: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

  @ManyToMany(() => User, (usuario) => usuario.empresas)
  usuario: User[]

  @Column()
  usuario_creador: string;

  @CreateDateColumn({
    type: 'timestamp', // O 'date' según prefieras
    default: () => 'CURRENT_TIMESTAMP'
  })
  fecha_creacion: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true
  })
  fecha_actualizacion: Date;
}