import { Module } from '@nestjs/common';
import { ProveedorCorreoService } from './proveedor-correo.service';
import { ProveedorCorreoController } from './proveedor-correo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorCorreo } from './entities/proveedor-correo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProveedorCorreo])
  ],
  controllers: [ProveedorCorreoController],
  providers: [ProveedorCorreoService],
})
export class ProveedorCorreoModule { }
