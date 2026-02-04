import { ApiProperty } from '@nestjs/swagger';
import { Estado } from 'src/estado/estado.entity';
import { Menu } from 'src/menus/menus.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'perfil', schema: 'db_fmc' })
export class Perfil {
  @PrimaryGeneratedColumn()
  perfil_id: number;

  @Column()
  @ApiProperty({ description: "nombre_perfil", example: "Administrador" })
  nombre_perfil: string;

  @OneToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  @ApiProperty({ description: "estado", example: 1 })
  estado: Estado;

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

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'modulo_has_perfil',
    joinColumn: {
      name: 'perfil_id',
      referencedColumnName: 'perfil_id'
    },
    inverseJoinColumn: {
      name: 'modulo_id',
      referencedColumnName: 'modulo_id'
    }
  })
  modulos: Menu[];
}
