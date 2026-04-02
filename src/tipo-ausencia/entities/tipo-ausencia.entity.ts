import { ApiProperty } from "@nestjs/swagger";
import { Ausencia } from "src/ausencias/entities/ausencia.entity";
import { Estado } from "src/estado/estado.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("tipo_ausencia", {schema: 'db_fmc'})
export class TipoAusencia {
    @PrimaryGeneratedColumn()
    @ApiProperty({description: "Identificador del tipo de ausencia", example:1})
    id:number;

    @Column()
    @ApiProperty({description: "Nombre del tipo de ausencia", example: "Vacaciones"})
    nombre:string;

    @Column()
    @ApiProperty({description: "Tipo del tipo de ausencia", example: 1 })
    tipo:number

 
    @ManyToOne(() => Estado)
    @JoinColumn({ name: 'estado_id' })
    @ApiProperty({ type: () => Estado, description: "estado", example: 1 })
    estado: Estado;

    @Column()
    @ApiProperty({description:"justifica horas", example:true})
    justifica_hrs:boolean

    @Column()
    @ApiProperty({description:"pagadas por el empleador", example:true})
    pagada_empleador:boolean

    @OneToMany(() => Ausencia, (ausencia) => ausencia.tipo_ausencia)
    ausencias: Ausencia[];
}
