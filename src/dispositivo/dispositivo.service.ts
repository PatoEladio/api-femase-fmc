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

  async create(dto: CreateDispositivoDto) {
    const nuevo = this.dispositivoRepository.create(dto);
    return await this.dispositivoRepository.save(nuevo);
  }

  async findAll() {
    return await this.dispositivoRepository.find({
      relations: ['cenco', 'estado', 'tipo_dispositivo'],
      order: { dispositivo_id: 'asc' }
    })
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

  /*
  async asignarDispositivoACenco(cencoId: number, dispositivoId: number) {
    const dispositivoAsignar = await this.dispositivoRepository.preload({
      dispositivo_id: dispositivoId,
      ...
    })
  }
  */
}
