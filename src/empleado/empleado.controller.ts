import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
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
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('empresa_id') empresa_id?: string,
    @Query('estado_id') estado_id?: string,
  ) {
    return this.empleadoService.findAll(
      +page || 1,
      +limit || 10,
      empresa_id ? +empresa_id : undefined,
      estado_id ? +estado_id : undefined
    );
  }

  @Get('run/:run')
  findByRun(@Param('run') run: string) {
    return this.empleadoService.findByRun(run);
  }

  @Get('nombre/:nombre')
  findByNombre(@Param('nombre') nombre: string) {
    return this.empleadoService.findByNombre(nombre);
  }

  @Get('empresa/:empresa_id')
  findByEmpresa(@Param('empresa_id') empresa_id: string) {
    return this.empleadoService.findByEmpresa(+empresa_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadoService.remove(+id);
  }
}
