import { Module } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { DispositivoController } from './dispositivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispositivo])],
  controllers: [DispositivoController],
  providers: [DispositivoService],
})
export class DispositivoModule {}
