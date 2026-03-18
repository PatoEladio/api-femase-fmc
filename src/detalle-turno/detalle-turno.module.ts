import { Module } from '@nestjs/common';
import { DetalleTurnoService } from './detalle-turno.service';
import { DetalleTurnoController } from './detalle-turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleTurno } from './entities/detalle-turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleTurno])],
  controllers: [DetalleTurnoController],
  providers: [DetalleTurnoService],
})
export class DetalleTurnoModule {}
