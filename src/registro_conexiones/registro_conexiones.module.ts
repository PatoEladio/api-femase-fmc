import { Module } from '@nestjs/common';
import { RegistroConexionesService } from './registro_conexiones.service';
import { RegistroConexionesController } from './registro_conexiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroConexione } from './entities/registro_conexione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroConexione])],
  controllers: [RegistroConexionesController],
  providers: [RegistroConexionesService],
  exports: [RegistroConexionesService],
})
export class RegistroConexionesModule { }
