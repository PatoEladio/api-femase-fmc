import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Empresas } from 'src/empresas/empresas.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'; 

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

    // 1. Si el usuario no existe, lanzamos excepción de inmediato
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar la clave ingresada (pass) con la hasheada (user.password)
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Generar el JWT si la comparación fue exitosa
    const payload = { sub: user.usuario_id, username: user.username };

    return {
      token: await this.jwtService.signAsync(payload),
      username: user.username,
      profile_id: user.perfil.perfil_id,
      profile: user.perfil.nombre_perfil,
      empresa_id: user.empresa.empresa_id,
      empresa: user.empresa.nombre_empresa
    };
  }
}
