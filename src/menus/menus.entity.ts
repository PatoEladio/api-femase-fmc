import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';

@Entity('db_fmc.modulo_has_perfil')
export class Menu {
  @PrimaryGeneratedColumn()
  modulo_id: number;

  @Column()
  nombre_modulo: string;

  @Column()
  modulo_padre_id: number;
}
