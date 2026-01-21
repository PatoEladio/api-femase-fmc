import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Departamento } from './departamento.entity';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('departamentos')
@UseGuards(AuthGuard)
export class DepartamentosController {
  constructor(
    private departamentoService: DepartamentosService
  ) { }

  @Get('')
  obtenerTodosLosDeptos(@Req() req) {
    const userId = req.user.sub;
    return this.departamentoService.buscarTodosLosDepartamentos(userId);
  }

  @Post('crear')
  crear(@Body() crearDepto: Departamento, @Req() req) {
    const usuario = req.user.username;
    return this.departamentoService.crearDepartamento(crearDepto, usuario);
  }

  @Patch('actualizar/:deptoId')
  actualizar(@Param('deptoId') id: string, @Body() updateDto: UpdateDepartamentoDto) {
    return this.departamentoService.actualizarDepto(+id, updateDto);
  }
}