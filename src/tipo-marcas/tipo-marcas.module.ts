import { Module } from '@nestjs/common';
import { TipoMarcasService } from './tipo-marcas.service';
import { TipoMarcasController } from './tipo-marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMarca } from './entities/tipo-marca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMarca])],
  controllers: [TipoMarcasController],
  providers: [TipoMarcasService],
})
export class TipoMarcasModule { }
