import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Feriado } from './entities/feriado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeriadosService {

  constructor(
    @InjectRepository(Feriado)
    private readonly feriadosRepository: Repository<Feriado>,
  ) {}

  async create(createFeriadoDto: CreateFeriadoDto) {
    const nuevoferiado = this.feriadosRepository.create(createFeriadoDto);
    return await this.feriadosRepository.save(nuevoferiado);
  }

  async findAll() {
    return await this.feriadosRepository.find({
      order: { id: 'ASC' }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feriado`;
  }

  async update(id: number, updateFeriadoDto: UpdateFeriadoDto) {
    const feriadoEditadp =  await this.feriadosRepository.preload({
      id: id,
      ...updateFeriadoDto,
    })

    if (!feriadoEditadp) {
      throw new NotFoundException(`El feriado con ID ${id} no existe`);
    }

    try {
      const actualizada = await this.feriadosRepository.save(feriadoEditadp);
      return {
        mensaje: 'Feriado actualizado con exito',
        id: actualizada.id
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el feriado');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
