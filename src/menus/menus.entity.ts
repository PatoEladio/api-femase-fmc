import { Perfil } from 'src/perfiles/perfil.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, ManyToMany } from 'typeorm';

@Entity('db_fmc.modulo')
export class Menu {
  @PrimaryGeneratedColumn()
  modulo_id: number;

  @Column()
  nombre_modulo: string;

  @Column()
  modulo_padre_id: number;

  @Column()
  tipo_modulo_id: number;

  @ManyToMany(() => Perfil, (perfil) => perfil.modulos)
  perfiles: Perfil[];
}
