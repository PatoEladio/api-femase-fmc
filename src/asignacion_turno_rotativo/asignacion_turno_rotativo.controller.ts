import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AsignacionTurnoRotativoService } from './asignacion_turno_rotativo.service';
import { CreateAsignacionTurnoRotativoDto } from './dto/create-asignacion_turno_rotativo.dto';
import { UpdateAsignacionTurnoRotativoDto } from './dto/update-asignacion_turno_rotativo.dto';

@Controller('asignacion-turno-rotativo')
export class AsignacionTurnoRotativoController {
  constructor(private readonly asignacionTurnoRotativoService: AsignacionTurnoRotativoService) {}

  @Post()
  create(@Body() createAsignacionTurnoRotativoDto: CreateAsignacionTurnoRotativoDto) {
    return this.asignacionTurnoRotativoService.create(createAsignacionTurnoRotativoDto);
  }

  @Get(":idEmpleado")
  findAll(@Param("idEmpleado") idEmpleado: string,
  @Query("page") page: string = "1"
  ) {
    return this.asignacionTurnoRotativoService.findAll(+idEmpleado, +page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionTurnoRotativoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsignacionTurnoRotativoDto: UpdateAsignacionTurnoRotativoDto) {
    return this.asignacionTurnoRotativoService.update(+id, updateAsignacionTurnoRotativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionTurnoRotativoService.remove(+id);
  }
}
