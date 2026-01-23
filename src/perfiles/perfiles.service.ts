import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from './perfil.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>
  ) { }

  async obtenerTodosLosPerfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find({ relations: ['estado'] });
  }

  async crearPerfil(perfil: Perfil, usuario: string) {
    try {
      const nuevo = this.perfilRepository.create(perfil);
      nuevo.usuario_creador = usuario;
      const guardada = this.perfilRepository.save(nuevo);

      return {
        perfil_id: (await guardada).perfil_id,
        nombre: (await guardada).nombre_perfil,
        mensaje: 'Perfil creada correctamente'
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El perfil ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear el registro en la base de datos');
    }
  }

  async actualizarPerfil(perfilId: number, infoActualizar: Perfil): Promise<Perfil | null> {
    await this.perfilRepository.update(perfilId, infoActualizar);
    return this.perfilRepository.findOne({ where: { perfil_id: perfilId } });
  }
}
