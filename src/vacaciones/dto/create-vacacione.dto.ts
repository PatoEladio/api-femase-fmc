import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsString()
  estadoId?: string;

  @IsOptional()
  @IsString()
  autorizador?: string;
}
