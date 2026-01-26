import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Empresas } from 'src/empresas/empresas.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    username: string,
    pass: string
  ): Promise<{ token: string, username: string, profile: string, profile_id: number, empresa_id: number, empresa: string }> {
    const user = await this.usersService.searchActiveUser(username);

    // Revisar comparación clave encriptada

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.usuario_id, username: user.username };

    return {
      token: await this.jwtService.signAsync(payload),
      username: user.username,
      profile_id: user.perfil.perfil_id,
      profile: user.perfil.nombre_perfil,
      empresa_id: user.empresa.empresa_id,
      empresa: user.empresa.nombre_empresa
    }
  }
}
