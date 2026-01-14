import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Estado } from 'src/estado/estado.entity';
import { Perfil } from 'src/perfiles/perfil.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('db_fmc.usuario')
export class User {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column()
  @ApiProperty({ description: "username", example: "bcarrion" })
  username: string;

  @Exclude()
  @Column()
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
}
