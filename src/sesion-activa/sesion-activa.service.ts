import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SesionActiva } from './entities/sesion-activa.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
const UAParser = require('ua-parser-js');

@Injectable()
export class SesionActivaService {
  constructor(
    @InjectRepository(SesionActiva)
    private readonly sesionActivaRepository: Repository<SesionActiva>,
  ) { }

  async registrarSesion(user: User, ip: string, userAgent: string) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const navegador = `${browser.name || 'Desconocido'}-${browser.version || ''}`;
    const sistemaOperativo = os.name || 'Desconocido';

    // Eliminar sesión anterior del usuario si existe
    await this.sesionActivaRepository.delete({ user: { usuario_id: user.usuario_id } });

    // Crear nueva sesión
    const sesion = this.sesionActivaRepository.create({
      user: user,
      ip: ip,
      navegador: navegador,
      sistema_operativo: sistemaOperativo,
      fecha_conexion: new Date(),
    });

    return await this.sesionActivaRepository.save(sesion);
  }

  async obtenerSesionesActivas() {
    return await this.sesionActivaRepository.find({
      relations: ['user', 'user.perfil'],
    });
  }

  async eliminarSesion(usuarioId: number) {
    return await this.sesionActivaRepository.delete({ user: { usuario_id: usuarioId } });
  }
}
