import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  async searchActiveUser(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        username,
        estado: {
          estado_id: 1
        }
      },
      relations: ['perfil', 'estado'],
    });
  }

  async buscarEmpleadosPorEstado(estadoId: number): Promise<User[]> {
    const busqueda = this.usersRepository.find({
      where: {
        estado: {
          estado_id: estadoId
        }
      },
      relations: [
        'perfil',
        'estado'
      ]
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron usuarios', 400)
    }
  }

  async buscarTodosLosUsuarios(): Promise<User[]> {
    const busqueda = this.usersRepository.find({
      relations: [
        'perfil',
        'estado'
      ]
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron usuarios', 400)
    }
  }

  async buscarUsuarioPorId(usuarioId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        usuario_id: usuarioId
      }, relations: ['estado', 'perfil']
    });
  }

  async crearUsuario(usuario: User) {
    const nuevoUsuario = this.usersRepository.create(usuario);
    return await this.usersRepository.save(nuevoUsuario);
  }
}