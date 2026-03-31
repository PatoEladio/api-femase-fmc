import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateVacacioneDto {
  @IsNotEmpty()
  @IsString()
  numFicha: string;

  @IsNotEmpty()
  @IsDate()
  fechaInicio: Date;

  @IsNotEmpty()
  @IsDate()
  fechaFin: Date;
}
