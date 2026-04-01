import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { VacacionesService } from './vacaciones.service';
import { CreateVacacioneDto } from './dto/create-vacacione.dto';
import { UpdateVacacioneDto } from './dto/update-vacacione.dto';

@Controller('vacaciones')
export class VacacionesController {
  constructor(private readonly vacacionesService: VacacionesService) { }

  @Patch('aprobar-rechazar')
  aprobarRechazarSolicitud(@Query('idSolicitud') idSolicitud: number, @Query('estado') estado: string, @Req() req: any) {
    return this.vacacionesService.aprobarRechazarSolicitud(idSolicitud, estado, req.username);
  }

  @Get('dias-disponibles')
  getDiasDisponibles(@Query('numFicha') numFicha: string) {
    return this.vacacionesService.getDiasDisponibles(numFicha);
  }

  @Get()
  findAll(@Query('numFicha') numFicha: string, @Query('fechaInicio') fechaInicio?: Date, @Query('fechaFin') fechaFin?: Date) {
    return this.vacacionesService.findAll(numFicha, fechaInicio, fechaFin);
  }

  @Post('solicitud')
  createSolicitudVacaciones(@Body() createVacacioneDto: CreateVacacioneDto, @Query('numFicha') numFicha: string) {
    return this.vacacionesService.createSolicitudVacaciones(createVacacioneDto, numFicha);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacacioneDto: UpdateVacacioneDto) {
    return this.vacacionesService.update(+id, updateVacacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacacionesService.remove(+id);
  }
}