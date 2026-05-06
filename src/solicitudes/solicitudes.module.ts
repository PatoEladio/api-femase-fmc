import { Module } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitude } from './entities/solicitude.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Empresa } from 'src/empresas/empresas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solicitude, Empleado,Empresa]),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule { }
