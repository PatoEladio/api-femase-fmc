import { Controller, Get, Delete, Param } from '@nestjs/common';
import { SesionActivaService } from './sesion-activa.service';

@Controller('sesion-activa')
export class SesionActivaController {
  constructor(private readonly sesionActivaService: SesionActivaService) {}

  @Get()
  obtenerSesionesActivas() {
    return this.sesionActivaService.obtenerSesionesActivas();
  }

  @Delete(':usuarioId')
  eliminarSesion(@Param('usuarioId') usuarioId: string) {
    return this.sesionActivaService.eliminarSesion(+usuarioId);
  }
  
}
