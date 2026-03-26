import { Module } from '@nestjs/common';
import { VacacionesService } from './vacaciones.service';
import { VacacionesController } from './vacaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacaciones } from './entities/vacaciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacaciones])],
  controllers: [VacacionesController],
  providers: [VacacionesService],
})
export class VacacionesModule { }
