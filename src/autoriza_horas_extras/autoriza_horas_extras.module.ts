import { Module } from '@nestjs/common';
import { AutorizaHorasExtrasService } from './autoriza_horas_extras.service';
import { AutorizaHorasExtrasController } from './autoriza_horas_extras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizaHorasExtra } from './entities/autoriza_horas_extra.entity';
import { Cargo } from 'src/cargos/entities/cargo.entity';
import { DetalleAsistenciaModule } from 'src/detalle-asistencia/detalle-asistencia.module';

@Module({
  imports: [TypeOrmModule.forFeature([AutorizaHorasExtra,Cargo]), DetalleAsistenciaModule],
  controllers: [AutorizaHorasExtrasController],
  providers: [AutorizaHorasExtrasService],
  exports:[AutorizaHorasExtrasService]
})
export class AutorizaHorasExtrasModule {}
