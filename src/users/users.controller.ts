import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
//@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) { }
  @Get('')
  buscarTodosLosEmpleados() {
    return this.userService.buscarTodosLosUsuarios();
  }

  @Get('buscarPorId/:usuarioId')
  buscarPorId(@Param() params) {
    return this.userService.buscarUsuarioPorId(params.usuarioId);
  }

  @Post('crear')
  crearCuenta(@Body() createUserDTO: User) {
    return this.userService.crearUsuario(createUserDTO);
  }

  @Get('recuperar-clave/:run')
  async recuperar(@Param('run') run: string) {
    return await this.userService.recuperarClave(run);
  }

  @Post('resetear-clave')
  async resetear(@Body() body: any) {
    const { run, codigo, nuevaClave } = body;
    return await this.userService.actualizarClave(run, codigo, nuevaClave);
  }
}