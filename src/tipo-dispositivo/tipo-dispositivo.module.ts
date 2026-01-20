import { Module } from '@nestjs/common';
import { TipoDispositivoService } from './tipo-dispositivo.service';
import { TipoDispositivoController } from './tipo-dispositivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDispositivo } from './entities/tipo-dispositivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDispositivo])],
  controllers: [TipoDispositivoController],
  providers: [TipoDispositivoService],
})
export class TipoDispositivoModule { }
