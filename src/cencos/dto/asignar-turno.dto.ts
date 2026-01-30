import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCencoDto } from "./create-cenco.dto";
import { IsArray, IsOptional } from "class-validator";

export class AsignarTurnoDto extends PartialType(CreateCencoDto) {
  @IsArray()
  @IsOptional()
  @ApiProperty({ example: [1, 2, 3], description: 'Lista con los IDs de los turnos' })
  turno_ids?: number[];
}