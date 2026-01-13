import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) { }
  @Get('obtenerEmpleadosEstado/:estadoId')
  buscarEmpleadosPorEstado(@Param() params) {
    return this.userService.buscarEmpleadosPorEstado(params.estadoId);
  }

  @Get('')
  buscarTodosLosEmpleados() {
    return this.userService.buscarTodosLosEmpleados();
  }
}