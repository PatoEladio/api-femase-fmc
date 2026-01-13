import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menus')
//@UseGuards(AuthGuard)
export class MenusController {
  constructor(private menuService: MenusService) { }
  
  @Get(':perfilId')
  obtenerMenusPorPerfil(@Param() params) {
    return this.menuService.obtenerMenusPorPerfil(params.perfilId);
  }
}
