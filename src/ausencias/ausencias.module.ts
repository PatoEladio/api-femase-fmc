import { Module } from '@nestjs/common';
import { AusenciasService } from './ausencias.service';
import { AusenciasController } from './ausencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ausencia } from './entities/ausencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ausencia])],
  controllers: [AusenciasController],
  providers: [AusenciasService],
})
export class AusenciasModule {}
