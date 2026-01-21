import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTipoDispositivoDto } from './dto/create-tipo-dispositivo.dto';
import { UpdateTipoDispositivoDto } from './dto/update-tipo-dispositivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoDispositivo } from './entities/tipo-dispositivo.entity';
import { Repository } from 'typeorm';
import { SearchTipoDispositivoDto } from './dto/search-tipo-dispositivo.dto';

@Injectable()
export class TipoDispositivoService {
  constructor(
    @InjectRepository(TipoDispositivo)
    private tipoDispositivoRepository: Repository<TipoDispositivo>
  ) { }

  async create(createTipoDispositivoDto: TipoDispositivo, usuario: string): Promise<CreateTipoDispositivoDto> {
    try {
      const nuevo = this.tipoDispositivoRepository.create(createTipoDispositivoDto);
      nuevo.usuario_creador = usuario;
      const guardada = this.tipoDispositivoRepository.save(nuevo);

      return {
        tipoDispositivoId: (await guardada).tipo_dispositivo_id,
        nombreTipoDispositivo: (await guardada).nombre_tipo,
        mensaje: 'Tipo de dispositivo creado correctamente'
      }

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La empresa ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear la empresa en la base de datos');
    }
  }

  async findAll(): Promise<SearchTipoDispositivoDto> {
    const busqueda = await this.tipoDispositivoRepository.find({
      order: {
        tipo_dispositivo_id: 'asc'
      },
      relations: ['estado']
    });

    if (busqueda.length > 0) {
      return {
        tipos: busqueda,
        mensaje: 'Busqueda realizada correctamente'
      }
    } else {
      return {
        tipos: [],
        mensaje: 'No se han encontrado tipos de dispositivo'
      }
    }
  }

  async update(id: number, updateTipoDispositivoDto: UpdateTipoDispositivoDto): Promise<any> {
    const tipoDis = await this.tipoDispositivoRepository.preload({
      tipo_dispositivo_id: id,
      ...updateTipoDispositivoDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!tipoDis) {
      throw new NotFoundException(`El tipo de dispositivo con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.tipoDispositivoRepository.save(tipoDis);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Tipo de dispositivo actualizado con exito',
        id: actualizada.tipo_dispositivo_id,
        nombre: actualizada.nombre_tipo,
        descripcion: actualizada.descripcion
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el nombre del tipo de dispositivo');
      }
      throw new InternalServerErrorException('Error al actualizar el tipo de dispositivo');
    }
  }
}
