import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnosRotativosService } from './turnos-rotativos.service';
import { CreateTurnosRotativoDto } from './dto/create-turnos-rotativo.dto';
import { UpdateTurnosRotativoDto } from './dto/update-turnos-rotativo.dto';

@Controller('turno-rotativo')
export class TurnosRotativosController {
  constructor(private readonly turnosRotativosService: TurnosRotativosService) {}

  @Post()
  create(@Body() createTurnosRotativoDto: CreateTurnosRotativoDto) {
    this.turnosRotativosService.create(createTurnosRotativoDto);
    return {
      message: 'Turno rotativo creado exitosamente',
    }
  }

  @Get()
  findAll() {
    return this.turnosRotativosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosRotativosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnosRotativoDto: UpdateTurnosRotativoDto) {
    return this.turnosRotativosService.update(+id, updateTurnosRotativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosRotativosService.remove(+id);
  }
}
