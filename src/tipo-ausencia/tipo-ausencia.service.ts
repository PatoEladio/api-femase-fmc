import { Injectable } from '@nestjs/common';
import { CreateTipoAusenciaDto } from './dto/create-tipo-ausencia.dto';
import { UpdateTipoAusenciaDto } from './dto/update-tipo-ausencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoAusencia } from './entities/tipo-ausencia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoAusenciaService {
  constructor(
    @InjectRepository(TipoAusencia)
    private readonly tipoAusenciaRepository: Repository<TipoAusencia>,
  ) { }

  async create(createTipoAusenciaDto: any) {
    const { estado_id, ...resto } = createTipoAusenciaDto;
    const tipoAusencia = this.tipoAusenciaRepository.create({
      ...resto,
      estado: { estado_id: estado_id },
    });
    await this.tipoAusenciaRepository.save(tipoAusencia);
    return {
      message: "Tipo ausencia creado con exito",
    }
  }

  findAll() {
    const tipoAusencias = this.tipoAusenciaRepository.find({
      relations: [
        'estado'
      ]
    });
    return tipoAusencias;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoAusencia`;
  }

  async update(id: number, updateTipoAusenciaDto: UpdateTipoAusenciaDto) {
    const { estado_id, ...resto } = updateTipoAusenciaDto;
    await this.tipoAusenciaRepository.update(id, { ...resto, estado: { estado_id: estado_id } });
    return {
      message: "Tipo ausencia actualizado con exito",
    }
  }

  remove(id: number) {
    return `This action removes a #${id} tipoAusencia`;
  }
}
