import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { Cenco } from './cenco.entity';
import { Turno } from 'src/turno/entities/turno.entity';
import { CencosService } from './cencos.service';
import { CencosController } from './cencos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cenco, Turno, Dispositivo])],
  providers: [CencosService],
  controllers: [CencosController]
})
export class CencosModule {}
//c
