import { PartialType } from '@nestjs/swagger';
import { Cargo } from '../entities/cargo.entity';

export class UpdateCargoDto extends PartialType(Cargo) {}
