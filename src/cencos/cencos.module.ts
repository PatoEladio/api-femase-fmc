import { Module } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { CencosController } from './cencos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cenco } from './cenco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cenco])],
  providers: [CencosService],
  controllers: [CencosController]
})
export class CencosModule {}
