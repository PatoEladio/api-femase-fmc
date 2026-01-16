import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Departamento } from './departamento.entity';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Controller('departamentos')
export class DepartamentosController {
  constructor(
    private departamentoService: DepartamentosService
  ) { }

  @Get(':empresaId')
  obtenerTodosLosDeptos(@Param('empresaId') id: number) {
    return this.departamentoService.buscarTodosLosDepartamentos(+id);
  }

  @Get('buscarDeptoPorId/:deptoId')
  buscarPorId(@Param('deptoId') id: string) {
    return this.departamentoService.buscarDepartamentoPorId(+id);
  }

  @Post('crear')
  crear(@Body() crearDepto: Departamento) {
    return this.departamentoService.crearDepartamento(crearDepto);
  }

  @Patch('actualizar/:deptoId')
  actualizar(@Param('deptoId') id: string, @Body() updateDto: UpdateDepartamentoDto) {
    return this.departamentoService.actualizarDepto(+id, updateDto);
  }
}