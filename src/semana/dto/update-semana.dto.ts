import { PartialType } from '@nestjs/swagger';
import { CreateSemanaDto } from './create-semana.dto';

export class UpdateSemanaDto extends PartialType(CreateSemanaDto) {}
