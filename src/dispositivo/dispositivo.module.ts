import { Module } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { DispositivoController } from './dispositivo.controller';

@Module({
  controllers: [DispositivoController],
  providers: [DispositivoService],
})
export class DispositivoModule {}
