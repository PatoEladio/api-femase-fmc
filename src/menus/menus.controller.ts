import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menus')
//@UseGuards(AuthGuard)
export class MenusController {
  constructor(private menuService: MenusService) { }

  @Get('buscar/:perfilId')
  obtenerMenusPorPerfil(@Param() params) {
    return this.menuService.obtenerMenusPorPerfil(params.perfilId);
  }

  @Get('')
  obtenerMenus() {
    return this.menuService.obtenerMenus();
  }

  @Get('submenus')
  obtenerSubmenus() {
    return this.menuService.obtenerSubmenus();
  }

  @Post('agregar')
  agregarSubmenusAPerfil(@Body() body) {
    const { listaSubmenus, perfilId } = body;
    return this.menuService.agregarSubmenus(listaSubmenus, perfilId);
  }

  @Get('submenus/:perfilId')
  obtenerSubmenusPorPerfil(@Param('perfilId') id: number) {
    return this.menuService.obtenerSubmenusPorPerfil(id);
  }
}
