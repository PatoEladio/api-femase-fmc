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
      relations: [
        'perfil', 
        'estado',
        'empresas'
      ],
    });
  }

  async buscarTodosLosUsuarios(): Promise<User[]> {
    const busqueda = this.usersRepository.find({
      relations: [
        'perfil',
        'estado',
        'empresas'
      ],
      select: {
        usuario_id: true,
        username: true,
        nombres: true,
        apellido_materno: true,
        apellido_paterno: true,
        empresas: {
          empresa_id: true,
          nombre_empresa: true
        },
        estado: true,
        perfil: true
      }
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
      }, 
      relations: [
        'estado',
        'perfil',
        'empresas'
      ]
    });
  }

  async crearUsuario(usuario: User) {
    const nuevoUsuario = this.usersRepository.create(usuario);
    return await this.usersRepository.save(nuevoUsuario);
  }
}