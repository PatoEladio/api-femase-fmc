import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>
  ) { }

  async create(createTurnoDto: Turno, usuario: string) {
    try {
      const nuevo = this.turnoRepository.create(createTurnoDto);
      //nuevo.usuario_creador = usuario;
      const guardada = await this.turnoRepository.save(nuevo);

      return {
        turno_id: guardada.turno_id,
        nombre: guardada.nombre,
        empresa: guardada.empresa
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El registro ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear el registro en la base de datos');
    }
  }

  findAll() {
    return this.turnoRepository.find({
      relations: ['empresa', 'horario', 'estado'],
      order: {
        turno_id: 'asc'
      }
    });
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto) {
    const result = await this.turnoRepository.preload({
      turno_id: id,
      ...updateTurnoDto,
    });

    if (!result) {
      throw new NotFoundException(`EL registro con ID ${id} no existe`);
    }

    try {
      const actualizada = await this.turnoRepository.save(result);

      return {
        mensaje: 'Registro actualizado con éxito',
        id: actualizada.turno_id
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro registro');
      }
      throw new InternalServerErrorException('Error al actualizar el registro');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} turno`;
  }
}
