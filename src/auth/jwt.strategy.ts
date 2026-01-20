import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ¡IMPORTANTE!: Usa la misma clave secreta que en tu AuthService
      secretOrKey: 'secret', 
    });
  }

  async validate(payload: any) {
    // Aquí es donde defines qué tendrá "req.user"
    // El payload contiene lo que pusiste en el 'signIn': { sub, username }
    return { 
      usuario_id: payload.sub, 
      username: payload.username 
    };
  }
}