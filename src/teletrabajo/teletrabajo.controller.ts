import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TeletrabajoService } from './teletrabajo.service';

@Controller('teletrabajo')
export class TeletrabajoController {
  constructor(private readonly teletrabajoService: TeletrabajoService) { }

  @Post('asignar/:idEmpleado')
  asignarTeletrabajo(@Param('idEmpleado') idEmpleado: number, @Body() body: { fecha_inicio: string, fecha_fin: string }) {
    return this.teletrabajoService.asignarTeletrabajo(idEmpleado, body.fecha_inicio, body.fecha_fin);
  }

  @Get('tiene/:runEmpleado')
  tieneTeletrabajo(@Param('runEmpleado') runEmpleado: string) {
    return this.teletrabajoService.tieneTeletrabajo(runEmpleado);
  }

  @Get('obtenerTeletrabajos/:idEmpresa')
  obtenerTeletrabajos(
    @Param('idEmpresa') idEmpresa: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.teletrabajoService.obtenerTeletrabajos(idEmpresa, +page, +limit);
  }

  @Put('editarTeletrabajo/:idEmpleado/:id/:horarioId')
  editarTeletrabajo(
    @Param('idEmpleado') idEmpleado: number,
    @Param('id') id: number,
    @Param('horarioId') horarioId: number,
  ) {
    return this.teletrabajoService.editarTeletrabajo(idEmpleado, id, horarioId);
  }

  @Delete('eliminarTeletrabajo/:idEmpleado/:id')
  eliminarTeletrabajo(
    @Param('idEmpleado') idEmpleado: number,
    @Param('id') id: number,
  ) {
    return this.teletrabajoService.eliminarTeletrabajo(idEmpleado, id);
  }

  @Get("obtenerTeleEmpleado/:idEmpleado")
  obtenerTeletrabajosPorEmpleado(
    @Param('idEmpleado') idEmpleado: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.teletrabajoService.obtenerTeletrabajosPorEmpleado(idEmpleado, +page, +limit);
  }
}
