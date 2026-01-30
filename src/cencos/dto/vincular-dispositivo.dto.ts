import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class VincularDispositivoDto {
  @ApiProperty({
    description: 'ID del dispositivo que ya existe en la DB',
    example: 1
  })
  @IsNumber()
  dispositivo_id: number;
}