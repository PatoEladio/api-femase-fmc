import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PerfilesService } from './perfiles.service';
import { Perfil } from './perfil.entity';

@Controller('perfiles')
export class PerfilesController {
  constructor(
    private perfilService: PerfilesService
  ) { }

  @Get('')
  obtenerPerfiles() {
    return this.perfilService.obtenerTodosLosPerfiles();
  }

  @Post('crear')
  crearNuevoPerfil(@Body() crearPerfilDTO: Perfil) {
    return this.perfilService.crearPerfil(crearPerfilDTO);
  }

  @Put('editar/:perfilId')
  editarPerfil(@Param('perfilId') perfilId: number, @Body() actualizarPerfilDTO: Perfil) {
    return this.perfilService.actualizarPerfil(perfilId, actualizarPerfilDTO);
  }

}
