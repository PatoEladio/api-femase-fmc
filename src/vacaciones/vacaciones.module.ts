import { Module } from '@nestjs/common';
import { VacacionesService } from './vacaciones.service';
import { VacacionesController } from './vacaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacaciones } from './entities/vacaciones.entity';
import { Empleado } from '../empleado/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacaciones, Empleado])],
  controllers: [VacacionesController],
  providers: [VacacionesService],
})
export class VacacionesModule { }
