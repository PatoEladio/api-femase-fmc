import { Module } from '@nestjs/common';
import { AsignacionTurnoRotativoService } from './asignacion_turno_rotativo.service';
import { AsignacionTurnoRotativoController } from './asignacion_turno_rotativo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionTurnoRotativo } from './entities/asignacion_turno_rotativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionTurnoRotativo])],
  controllers: [AsignacionTurnoRotativoController],
  providers: [AsignacionTurnoRotativoService],
})
export class AsignacionTurnoRotativoModule {}
