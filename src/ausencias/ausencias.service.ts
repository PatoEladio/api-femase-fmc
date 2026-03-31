import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAusenciaDto } from './dto/create-ausencia.dto';
import { UpdateAusenciaDto } from './dto/update-ausencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ausencia } from './entities/ausencia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AusenciasService {
  constructor(
    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
  ) { }

  async create(createAusenciaDto: CreateAusenciaDto) {
    const existe = await this.ausenciaRepository.query(
      `SELECT * FROM db_fmc.ausencias WHERE num_ficha = $1 AND $2 BETWEEN fecha_inicio AND fecha_fin`,
      [createAusenciaDto.num_ficha, createAusenciaDto.fecha_inicio]
    );

    if (existe.length > 0) {
      throw new BadRequestException('Ya existe una ausencia en esa fecha');
    }
    return this.ausenciaRepository.save(createAusenciaDto as any);
  }

  update(id: number, updateAusenciaDto: UpdateAusenciaDto) {
    return `This action updates a #${id} ausencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} ausencia`;
  }
}
