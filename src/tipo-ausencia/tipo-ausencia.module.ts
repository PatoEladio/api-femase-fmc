import { Module } from '@nestjs/common';
import { TipoAusenciaService } from './tipo-ausencia.service';
import { TipoAusenciaController } from './tipo-ausencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoAusencia } from './entities/tipo-ausencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoAusencia])],
  controllers: [TipoAusenciaController],
  providers: [TipoAusenciaService],
})
export class TipoAusenciaModule {}
