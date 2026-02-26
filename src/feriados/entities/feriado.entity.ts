import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('db_fmc.feriados') 
export class Feriado {

    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'id', example: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: 'fecha', example: '2026-01-01' })
    fecha: String;

    @Column()
    @ApiProperty({ description: 'tipo_feriado', example: 'Nacional' })
    tipo_feriado: string;

    @Column()
    @ApiProperty({ description: 'nombre', example: 'Feriado' })
    nombre: String;

    @Column()
    @ApiProperty({ description: 'observacion', example: 'Feriado' })
    observacion: string;

    @Column()
    @ApiProperty({ description: 'irrenunciable', example: true })
    irrenunciable: boolean;

    @Column()
    @ApiProperty({ description: 'tipo', example: 'Civil' })
    tipo: string;

    @Column()
    @ApiProperty({ description: 'respaldo legal', example: 'ley 2.977' })
    respaldo_legal: string;

    @Column()
    @ApiProperty({ description: 'region', example: 'Region Metropolitana' })
    region: string;

    @Column()
    @ApiProperty({ description: 'comuna', example: 'Santiago' })
    comuna: string;
}