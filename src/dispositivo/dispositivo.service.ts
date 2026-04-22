import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';
import { SearchDispositivoDto } from './dto/search-dispositivo.dto';
import { Empleado } from 'src/empleado/entities/empleado.entity';

@Injectable()
export class DispositivoService {
  constructor(
    @InjectRepository(Dispositivo)
    private dispositivoRepository: Repository<Dispositivo>,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
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
    if (!dispositivo) {
      throw new NotFoundException(`El dispositivo con ID ${id} no existe`);
    }

    try {
      const actualizada = await this.dispositivoRepository.save(dispositivo);

      return {
        mensaje: 'Dispositivo actualizado con exito',
        id: actualizada.dispositivo_id
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el dispositivo');
      }
      throw new InternalServerErrorException('Error al actualizar el dispositivo');
    }
  }

  async buscarDispositivosPorEmpleado(rut: string) {
    const empleados = await this.empleadoRepository.find({
      where: { run: rut },
      relations: ['cenco']
    });

    if (!empleados || empleados.length === 0) {
      throw new NotFoundException(`No se encontraron empleados con RUT ${rut}`);
    }

    const cencoIds = [...new Set(empleados.map(emp => emp.cenco?.cenco_id).filter(id => id != null))];

    if (cencoIds.length === 0) {
      return [];
    }

    const dispositivos = await this.dispositivoRepository.find({
      where: {
        cenco: { cenco_id: In(cencoIds) }
      },
      relations: ['cenco']
    });

    return dispositivos;
  }


}
