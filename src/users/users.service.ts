import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Perfil } from '../perfiles/perfil.entity';

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
    return this.usersRepository.find({
      where: {
        estado: {
          estado_id: estadoId
        }
      },
      relations: ['perfil', 'estado']
    })
  }

  async buscarTodosLosEmpleados(): Promise<User[]> { 
    return this.usersRepository.find({
      relations: ['perfil', 'estado']
    });
  }

  async crearUsuario(usuario: User) {
    const nuevoUsuario = this.usersRepository.create(usuario);
    return await this.usersRepository.save(nuevoUsuario);
  }
}