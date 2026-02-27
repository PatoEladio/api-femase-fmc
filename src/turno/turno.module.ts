import { Module } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { TurnoController } from './turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cenco } from 'src/cencos/cenco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Empleado, Cenco])],
  controllers: [TurnoController],
  providers: [TurnoService],
})
export class TurnoModule { }
