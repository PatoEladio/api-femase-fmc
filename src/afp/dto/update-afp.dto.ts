import { PartialType } from '@nestjs/swagger';
import { CreateAfpDto } from './create-afp.dto';

export class UpdateAfpDto extends PartialType(CreateAfpDto) {}
