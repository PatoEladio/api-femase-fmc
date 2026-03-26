import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VacacionesService } from './vacaciones.service';
import { CreateVacacioneDto } from './dto/create-vacacione.dto';
import { UpdateVacacioneDto } from './dto/update-vacacione.dto';

@Controller('vacaciones')
export class VacacionesController {
  constructor(private readonly vacacionesService: VacacionesService) { }

  @Post()
  create(@Body() createVacacioneDto: CreateVacacioneDto) {
    return this.vacacionesService.create(createVacacioneDto);
  }

  @Get()
  findAll(@Query('numFicha') numFicha: string, @Query('fechaInicio') fechaInicio?: Date, @Query('fechaFin') fechaFin?: Date) {
    return this.vacacionesService.findAll(numFicha, fechaInicio, fechaFin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacacionesService.findOne(+id);
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
