import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Feriado } from './entities/feriado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FeriadosService {

  constructor(
    @InjectRepository(Feriado)
    private readonly feriadosRepository: Repository<Feriado>,
  ) { }

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
    const feriadoEditadp = await this.feriadosRepository.preload({
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

  async seed() {
    const count = await this.feriadosRepository.count();
    if (count > 0) {
      return { mensaje: 'La tabla feriados ya contiene datos', total: count };
    }

    const filePath = path.join(process.cwd(), 'utils', 'feriados.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const feriados: any[] = JSON.parse(rawData);

    const entidades: Feriado[] = feriados.map((f) => {
      const { id, ...data } = f;
      return this.feriadosRepository.create(data as Partial<Feriado>);
    });

    await this.feriadosRepository.save(entidades);
    return { mensaje: 'Feriados insertados con éxito', total: entidades.length };
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
