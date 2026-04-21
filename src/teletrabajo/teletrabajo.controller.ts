import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeletrabajoService } from './teletrabajo.service';

@Controller('teletrabajo')
export class TeletrabajoController {
  constructor(private readonly teletrabajoService: TeletrabajoService) {}

  @Post('asignar/:idEmpleado')
  asignarTeletrabajo(@Param('idEmpleado') idEmpleado: number, @Body() body: {fecha_inicio:string, fecha_fin:string}) {
    return this.teletrabajoService.asignarTeletrabajo(idEmpleado, body.fecha_inicio, body.fecha_fin);
  }

  @Get('tiene/:runEmpleado')
  tieneTeletrabajo(@Param('runEmpleado') runEmpleado: string) {
    return this.teletrabajoService.tieneTeletrabajo(runEmpleado);
  }
}
