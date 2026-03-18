import { Inject, Injectable } from '@nestjs/common';
import { CreateTipoMarcaDto } from './dto/create-tipo-marca.dto';
import { UpdateTipoMarcaDto } from './dto/update-tipo-marca.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoMarca } from './entities/tipo-marca.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoMarcasService {

  constructor(@InjectRepository(TipoMarca)
  private tipoMarcasRepository: Repository<TipoMarca>
  ) { }

  create(createTipoMarcaDto: CreateTipoMarcaDto) {
    const nuevoTipoMarca = this.tipoMarcasRepository.create(createTipoMarcaDto);
    return this.tipoMarcasRepository.save(nuevoTipoMarca);
  }

  findAll() {
    return this.tipoMarcasRepository.find({
      relations: {
        estado_id: true
      },  
      order:{
        id:"ASC"
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoMarca`;
  }

  update(id: number, updateTipoMarcaDto: UpdateTipoMarcaDto) {
    const tipoMarca = this.tipoMarcasRepository.findOne({
      where:{
        id:id
      }
    });
    if (!tipoMarca) {
      throw new Error('TipoMarca no encontrado');
    }
    return this.tipoMarcasRepository.update(id, updateTipoMarcaDto);
  }

  remove(id: number) {
    return `This action removes a #${id} tipoMarca`;
  }
}
