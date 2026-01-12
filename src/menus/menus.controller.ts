import { Controller, Get, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menus')
export class MenusController {
  constructor(private menuService: MenusService) { }
  
  @UseGuards(AuthGuard)
  @Get()
  obtenerMenusPorPerfil() {
    return this.menuService.obtenerMenusPorPerfil(1);
  }
}
