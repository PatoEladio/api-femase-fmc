import { Module } from '@nestjs/common';
import { RegistroEventoService } from './registro_evento.service';
import { RegistroEventoController } from './registro_evento.controller';

@Module({
  controllers: [RegistroEventoController],
  providers: [RegistroEventoService],
})
export class RegistroEventoModule {}
