import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnoHorarioService } from './turno-horario.service';
import { CreateTurnoHorarioDto } from './dto/create-turno-horario.dto';
import { UpdateTurnoHorarioDto } from './dto/update-turno-horario.dto';

@Controller('turno-horario')
export class TurnoHorarioController {
  constructor(private readonly turnoHorarioService: TurnoHorarioService) {}

  @Post()
  create(@Body() createTurnoHorarioDto: CreateTurnoHorarioDto) {
    return this.turnoHorarioService.create(createTurnoHorarioDto);
  }

  @Get()
  findAll() {
    return this.turnoHorarioService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoHorarioDto: UpdateTurnoHorarioDto) {
    return this.turnoHorarioService.update(+id, updateTurnoHorarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnoHorarioService.remove(+id);
  }
}
