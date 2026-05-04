import { Module } from '@nestjs/common';
import { FirmasService } from './firmas.service';
import { FirmasController } from './firmas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firma } from './entities/firma.entity';
import { Empresa } from 'src/empresas/empresas.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Firma, Empleado, Empresa])
  ],
  controllers: [FirmasController],
  providers: [FirmasService],
})
export class FirmasModule {}
