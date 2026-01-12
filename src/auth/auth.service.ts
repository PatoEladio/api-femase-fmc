import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ): Promise<{ token: string, username: string, profile: string, profile_id: number }> {
    const user = await this.usersService.searchActiveUser(username);
    
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.usuario_id, username: user.username };

    return {
      token: await this.jwtService.signAsync(payload),
      username: user.username,
      profile: user.perfil.nombre_perfil,
      profile_id: user.perfil.perfil_id
    }
  }
}
