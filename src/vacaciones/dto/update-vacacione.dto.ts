import { PartialType } from '@nestjs/swagger';
import { CreateVacacioneDto } from './create-vacacione.dto';

export class UpdateVacacioneDto extends PartialType(CreateVacacioneDto) {}
