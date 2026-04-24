import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SesionActivaService } from 'src/sesion-activa/sesion-activa.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sesionActivaService: SesionActivaService
  ) { }

  async signIn(
    username: string,
    pass: string,
    req: Request
  ): Promise<{ token: string, username: string, profile: string, profile_id: number, empresa_id: number, empresa: string, num_ficha: string, rut: string }> {

    const user = await this.usersService.searchActiveUser(username);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.empleado && user.empleado.contrato_indefinido === false && user.empleado.fecha_fin_contrato) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const finContrato = new Date(user.empleado.fecha_fin_contrato);
      finContrato.setHours(0, 0, 0, 0);

      if (finContrato < hoy) {
        throw new UnauthorizedException('Su contrato se encuentra vencido. No puede iniciar sesión.');
      }
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.usuario_id, username: user.username, profile: user.perfil.perfil_id, num_ficha: user.empleado.num_ficha, nombre_completo: user.empleado.nombres + ' ' + user.empleado.apellido_paterno + ' ' + user.empleado.apellido_materno, empresa: user.empresa.nombre_empresa, rut: user.empleado.run , empresa_id: user.empresa.empresa_id};

    // Registrar la sesión activa
    const ip = req.headers['x-forwarded-for'] as string || req.ip || 'Desconocida';
    const userAgent = req.headers['user-agent'] || '';
    await this.sesionActivaService.registrarSesion(user, ip, userAgent);

    return {
      token: await this.jwtService.signAsync(payload),
      username: user.username,
      profile_id: user.perfil.perfil_id,
      profile: user.perfil.nombre_perfil,
      empresa_id: user.empresa.empresa_id,
      empresa: user.empresa.nombre_empresa,
      num_ficha: user.empleado.num_ficha,
      rut: user.empleado.run,
    };
  }
}
