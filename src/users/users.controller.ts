import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
//@UseGuards(AuthGuard)
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

  @Post('crear')
  crearCuenta(@Body() createUserDTO: User) {
    return this.userService.crearUsuario(createUserDTO);
  }
}