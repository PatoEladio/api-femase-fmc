import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Empresa } from './empresas.entity';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('empresas')
@UseGuards(AuthGuard)
export class EmpresasController {
  constructor(
    private empresaService: EmpresasService
  ) { }

  @Get('')
  obtenerTodasLasEmpresas(@Req() req) {
    const usuarioId = req.user.sub;
    const usuario = req.user.username;
    return this.empresaService.obtenerTodasLasEmpresas(usuarioId, usuario);
  }

  @Post('crear')
  create(@Body() crearEmpresa: Empresa) {
    return this.empresaService.create(crearEmpresa);
  } c

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateEmpresaDto) {
    return this.empresaService.actualizarEmpresa(+id, updateDto);
  }
}