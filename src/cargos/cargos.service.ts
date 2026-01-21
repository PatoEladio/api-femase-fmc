import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cargo } from './entities/cargo.entity';
import { Repository } from 'typeorm';
import { SearchCargoDto } from './dto/search-cargo.dto';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>
  ) { }

  create(createCargoDto: CreateCargoDto) {
    return 'This action adds a new cargo';
  }

  async findAll(userId: number): Promise<SearchCargoDto> {
    const busqueda = await this.cargoRepository.find({
      where: {
        empresa: {
          usuario: { usuario_id: userId }
        }
      }
    })

    if (busqueda.length > 0) {
      return {
        cargos: busqueda,
        mensaje: 'Cargos encontrados!'
      }
    } else {
      return {
        cargos: [],
        mensaje: 'No se han encontrado cargos'
      }
    }

  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return `This action updates a #${id} cargo`;
  }
}
