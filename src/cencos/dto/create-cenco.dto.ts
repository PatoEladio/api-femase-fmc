import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDispositivoDto } from 'src/dispositivo/dto/create-dispositivo.dto'; // Ajusta la ruta
import { VincularDispositivoDto } from './vincular-dispositivo.dto';

export class CreateCencoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Nombre del Centro de Costo", example: "PPF CALAMA" })
  nombre_cenco: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Dirección física", example: "Calama" })
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Región", example: "Antofagasta" })
  region: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Comuna", example: "Calama" })
  comuna: string;

  @IsEmail()
  @ApiProperty({ description: "Email de contacto general", example: "contacto@calama.cl" })
  email_general: string;

  @IsEmail()
  @ApiProperty({ description: "Email para recibir notificaciones", example: "alertas@calama.cl" })
  email_notificacion: string;

  @IsBoolean()
  @ApiProperty({ description: "Si pertenece a zona extrema", example: false })
  zona_extrema: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Usuario que registra el centro", example: "admin_user" })
  usuario_creador: string;

  // --- RELACIONES POR ID ---

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "ID del estado (FK)", example: 1 })
  estado_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "ID del departamento (FK)", example: 1 })
  departamento_id: number;

  // --- RELACIÓN OPCIONAL DE DISPOSITIVOS ---
  @ApiProperty({
    type: [VincularDispositivoDto],
    description: 'Lista de IDs de dispositivos ya existentes para vincular al Cenco',
    required: false,
    example: [{ dispositivo_id: 1 }, { dispositivo_id: 2 }]
  })

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VincularDispositivoDto)
  dispositivos?: VincularDispositivoDto[];
}