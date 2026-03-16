import { Module } from '@nestjs/common';
import { TurnosRotativosService } from './turnos-rotativos.service';
import { TurnosRotativosController } from './turnos-rotativos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosRotativo } from './entities/turnos-rotativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TurnosRotativo])],
  controllers: [TurnosRotativosController],
  providers: [TurnosRotativosService],
})
export class TurnosRotativosModule { }
