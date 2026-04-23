import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'horas_legales', schema: 'db_fmc' })
export class HorasLegale {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  hora:number
}
