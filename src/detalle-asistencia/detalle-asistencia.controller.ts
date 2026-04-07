import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleAsistenciaService } from './detalle-asistencia.service';
import { CreateDetalleAsistenciaDto } from './dto/create-detalle-asistencia.dto';
import { UpdateDetalleAsistenciaDto } from './dto/update-detalle-asistencia.dto';

@Controller('detalle-asistencia')
export class DetalleAsistenciaController {
  constructor(private readonly detalleAsistenciaService: DetalleAsistenciaService) {}

  @Post()
  create(@Body() createDetalleAsistenciaDto: CreateDetalleAsistenciaDto) {
    return this.detalleAsistenciaService.create(createDetalleAsistenciaDto);
  }

  @Get()
  findAll() {
    return this.detalleAsistenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleAsistenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleAsistenciaDto: UpdateDetalleAsistenciaDto) {
    return this.detalleAsistenciaService.update(+id, updateDetalleAsistenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleAsistenciaService.remove(+id);
  }
}
