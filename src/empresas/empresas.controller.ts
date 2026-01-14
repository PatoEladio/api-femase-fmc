import { Controller, Get, Param } from '@nestjs/common';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {
  constructor(
    private empresaService: EmpresasService
  ) { }

  @Get('')
  obtenerTodasLasEmpresas() {
    return this.empresaService.obtenerTodasLasEmpresas();
  }

  @Get('buscarPorEstado/:estadoId')
  obtenerEmpresasPorEstado(@Param() params) {
    return this.empresaService.buscarEmpresasPorEstado(params.estadoId);
  }
}
