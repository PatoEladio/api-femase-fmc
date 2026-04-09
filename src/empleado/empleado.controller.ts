import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) { }


  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadoService.update(+id, updateEmpleadoDto);
  }

  @Post()
  create(@Body() createEmpleadoDto: Empleado) {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':run')
  findByRun(@Param('run') run: string) {
    return this.empleadoService.findByRun(run);
  }

  @Get(':nombre')
  findByNombre(@Param('nombre') nombre: string) {
    return this.empleadoService.findByNombre(nombre);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadoService.remove(+id);
  }
}

