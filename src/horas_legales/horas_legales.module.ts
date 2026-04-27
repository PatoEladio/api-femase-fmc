import { Module } from '@nestjs/common';
import { HorasLegalesService } from './horas_legales.service';
import { HorasLegalesController } from './horas_legales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorasLegale } from './entities/horas_legale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorasLegale])
  ],
  controllers: [HorasLegalesController],
  providers: [HorasLegalesService],
  exports: [HorasLegalesService],
})
export class HorasLegalesModule { }
