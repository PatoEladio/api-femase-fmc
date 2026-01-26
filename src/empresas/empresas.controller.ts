import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Empresas } from './empresas.entity';
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
  crearEmpresa(@Body() crearEmpresa: Empresas, @Req() req) {
    const usuario = req.user.username;
    const id = req.user.sub;
    return this.empresaService.crearEmpresa(crearEmpresa, usuario, id);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateEmpresaDto) {
    return this.empresaService.actualizarEmpresa(+id, updateDto);
  }
}