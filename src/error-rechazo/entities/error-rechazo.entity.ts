import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'error_rechazo', schema: 'db_fmc' })
export class ErrorRechazo {

    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Identificador de error rechazo', example: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: 'Descripcion del error rechazo', example: 'Error Rechazo' })
    descripcion: string;
}
