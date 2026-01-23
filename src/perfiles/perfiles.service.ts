import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from './perfil.entity';
import { Repository } from 'typeorm';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>
  ) { }

  async obtenerTodosLosPerfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find({ relations: ['estado'] });
  }

  async crearPerfil(perfil: Perfil, usuario: string): Promise<CreatePerfilDto> {
    try {
      const nuevo = this.perfilRepository.create(perfil);
      nuevo.usuario_creador = usuario;
      const guardada = this.perfilRepository.save(nuevo);

      return {
        perfil_id: (await guardada).perfil_id,
        nombre: (await guardada).nombre_perfil,
        mensaje: 'Perfil creado correctamente'
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

  async actualizarPerfil(id: number, infoActualizar: UpdatePerfilDto): Promise<any> {
    const perfil = await this.perfilRepository.preload({
      perfil_id: id,
      ...infoActualizar,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!perfil) {
      throw new NotFoundException(`EL perfil con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.perfilRepository.save(perfil);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Perfil actualizado con éxito',
        id: actualizada.perfil_id,
        nombre: actualizada.nombre_perfil
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro perfil');
      }
      throw new InternalServerErrorException('Error al actualizar el perfil');
    }
  }
}
