import { PartialType } from '@nestjs/swagger';
import { CreateErrorRechazoDto } from './create-error-rechazo.dto';

export class UpdateErrorRechazoDto extends PartialType(CreateErrorRechazoDto) {}
