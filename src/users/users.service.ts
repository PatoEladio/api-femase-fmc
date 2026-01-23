import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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
  // IDEA NUEVA DEJAR LOS EMPLEADOS CON SU RESPECTIVA EMPRESA EN LA MISMA TABLA Y SI EL PERFIL DE USUARIO QUE INGRESA ES SUPERADMIN ENVIAR TODAS LAS EMPRESAS
  async buscarTodosLosUsuarios(): Promise<User[]> {
    const busqueda = this.usersRepository.find({
      relations: [
        'perfil',
        'estado',
        'empresas'
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
      },
      relations: [
        'estado',
        'perfil',
        'empresas'
      ]
    });
  }

  async crearUsuario(usuario: User): Promise<any> {
    return 'a';
  }
}