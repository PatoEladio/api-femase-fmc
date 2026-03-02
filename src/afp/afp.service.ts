import { Injectable } from '@nestjs/common';
import { CreateAfpDto } from './dto/create-afp.dto';
import { UpdateAfpDto } from './dto/update-afp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Afp } from './entities/afp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AfpService {
  constructor(
    @InjectRepository(Afp)
    private readonly afpRepository: Repository<Afp>,
  ) {}

  async buscarTodasLasAfp() {
    const busqueda = await this.afpRepository.find({
      order:{
        afp_id: "ASC"
      }
    });
    if (busqueda.length === 0 ) {
      return {afp: []};
    }
    return {afp: busqueda};
  }

  async create(createAfpDto: CreateAfpDto) {
    const nuevoAfp = this.afpRepository.create(createAfpDto);
    return await this.afpRepository.save(nuevoAfp);
  }


  findOne(id: number) {
    return `This action returns a #${id} afp`;
  }

 async update(id: number, updateAfpDto: UpdateAfpDto) {
    const afpActualizada = await this.afpRepository.update(id, updateAfpDto);
    return afpActualizada;
  }

  async remove(id: number) {
    return `This action removes a #${id} afp`;
  }
}
