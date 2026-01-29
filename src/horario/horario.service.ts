import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>
  ) { }


  async create(createHorarioDto: Horario): Promise<Horario> {
    try {
      const nuevo = this.horarioRepository.create(createHorarioDto);
      //nuevo.usuario_creador = usuario;
      const guardada = await this.horarioRepository.save(nuevo);

      return {
        horario_id: guardada.horario_id,
        hora_entrada: guardada.hora_entrada,
        hora_salida: guardada.hora_salida,
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
    return this.horarioRepository.find({
      order: {
        horario_id: 'asc'
      },
      relations: ['empresa']
    });
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto) {
    const result = await this.horarioRepository.preload({
      horario_id: id,
      ...updateHorarioDto,
    });

    if (!result) {
      throw new NotFoundException(`EL registro con ID ${id} no existe`);
    }

    try {
      const actualizada = await this.horarioRepository.save(result);

      return {
        mensaje: 'Registro actualizado con éxito',
        id: actualizada.horario_id
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro registro');
      }
      throw new InternalServerErrorException('Error al actualizar el registro');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} horario`;
  }
}
