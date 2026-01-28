import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cenco } from './cenco.entity';
import { Repository } from 'typeorm';
import { CencoCreadoDTO } from './dto/created-cenco.dto';
import { UpdateCencoDTO } from './dto/update-cenco.dto';
import { SearchCencoDto } from './dto/search-cenco.dto';

@Injectable()
export class CencosService {
  constructor(
    @InjectRepository(Cenco)
    private cencoRepository: Repository<Cenco>
  ) { }

  async obtenerTodosLosCencos(): Promise<SearchCencoDto> {
    const busqueda = this.cencoRepository.find({
      relations: [
        'estado',
        'depto'
      ],
      order: {
        cenco_id: 'ASC'
      }
    });

    if ((await busqueda).length > 0) {
      return {
        centros: await busqueda
      }
    } else {
      return {
        centros: []
      }
    }
  }

  async crearCenco(cenco: Cenco, usuario: string): Promise<CencoCreadoDTO> {
    try {
      const nuevo = this.cencoRepository.create(cenco);
      nuevo.usuario_creador = usuario;
      const guardada = this.cencoRepository.save(nuevo);

      return {
        cenco_id: (await guardada).cenco_id,
        nombre_cenco: (await guardada).nombre_cenco,
        mensaje: 'Centro de costo creado correctamente'
      }

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El centro de costo ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear el centro de costo en la base de datos');
    }
  }

  async actualizarCenco(id: number, updateDto: UpdateCencoDTO): Promise<any> {
    const cenco = await this.cencoRepository.preload({
      cenco_id: id,
      ...updateDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!cenco) {
      throw new NotFoundException(`El centro de costo con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.cencoRepository.save(cenco);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Centro de costo actualizado con éxito',
        id: actualizada.cenco_id,
        nombre: actualizada.nombre_cenco
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el centro de costo');
      }
      throw new InternalServerErrorException('Error al actualizar el centro de costo');
    }
  }
}
