import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';
import { SearchDispositivoDto } from './dto/search-dispositivo.dto';

@Injectable()
export class DispositivoService {
  constructor(
    @InjectRepository(Dispositivo)
    private dispositivoRepository: Repository<Dispositivo>
  ) { }

  async create(createDispositivoDto: Dispositivo): Promise<CreateDispositivoDto> {
    try {
      const nuevo = this.dispositivoRepository.create(createDispositivoDto);
      const guardada = this.dispositivoRepository.save(nuevo);

      return {
        dispositivoId: (await guardada).dispositivo_id,
        nombreDispositivo: (await guardada).nombre,
        mensaje: 'Dispositivo creado correctamente'
      }

    } catch (error) {
      // Error de PostgreSQL/MySQL para "llave duplicada" (comúnmente código 23505)
      if (error.code === '23505') {
        throw new ConflictException('El dispositivo ya existe o el identificador está duplicado');
      }

      // Error de validación de datos
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      // Error genérico por si falla la conexión o algo inesperado
      throw new InternalServerErrorException('Error crítico al crear el dispositivo en la base de datos');
    }
  }

  async findAll(): Promise<SearchDispositivoDto> {
    const busqueda = await this.dispositivoRepository.find({
      relations: ['tipo_dispositivo', 'estado'],
      order: {
        dispositivo_id: 'asc'
      }
    })

    if (busqueda.length > 0) {
      return {
        dispositivos: busqueda,
        mensaje: 'Busqueda realizada correctamente'
      }
    } else {
      return {
        dispositivos: [],
        mensaje: 'No se encontraron dispositivos'
      }
    }
  }

  async update(id: number, updateDispositivoDto: UpdateDispositivoDto): Promise<any> {
    const dispositivo = await this.dispositivoRepository.preload({
      dispositivo_id: id,
      ...updateDispositivoDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!dispositivo) {
      throw new NotFoundException(`El dispositivo con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.dispositivoRepository.save(dispositivo);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Dispositivo actualizado con exito',
        id: actualizada.dispositivo_id
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el dispositivo');
      }
      throw new InternalServerErrorException('Error al actualizar el dispositivo');
    }
  }
}
