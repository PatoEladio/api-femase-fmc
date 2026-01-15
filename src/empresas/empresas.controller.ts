import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Empresas } from './empresas.entity';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(
    private empresaService: EmpresasService
  ) { }

  @Get('')
  obtenerTodasLasEmpresas() {
    return this.empresaService.obtenerTodasLasEmpresas();
  }

  @Get('buscarPorId/:id')
  buscarPorId(@Param('id') id: string) {
    return this.empresaService.buscarEmpresaPorId(+id);
  }

  @Post('crear')
  crearEmpresa(@Body() crearEmpresa: Empresas) {
    return this.empresaService.crearEmpresa(crearEmpresa);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateEmpresaDto) {
    return this.empresaService.actualizarEmpresa(+id, updateDto);
  }
}