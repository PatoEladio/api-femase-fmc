import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PerfilesService } from './perfiles.service';
import { Perfil } from './perfil.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('perfiles')
@UseGuards(AuthGuard)
export class PerfilesController {
  constructor(
    private perfilService: PerfilesService
  ) { }

  @Get('')
  obtenerPerfiles() {
    return this.perfilService.obtenerTodosLosPerfiles();
  }

  @Post('crear')
  crearNuevoPerfil(@Body() crearPerfilDTO: Perfil, @Req() req) {
    const usuario = req.user.username;
    return this.perfilService.crearPerfil(crearPerfilDTO, usuario);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdatePerfilDto) {
    return this.perfilService.actualizarPerfil(+id, updateDto);
  }
}