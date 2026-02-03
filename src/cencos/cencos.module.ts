import { Module } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { CencosController } from './cencos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cenco } from './cenco.entity';
import { Turno } from 'src/turno/entities/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cenco, Turno])],
  providers: [CencosService],
  controllers: [CencosController]
})
export class CencosModule {}
//c
