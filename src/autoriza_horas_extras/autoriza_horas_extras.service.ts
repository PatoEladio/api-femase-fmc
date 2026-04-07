import { Injectable } from '@nestjs/common';
import { CreateAutorizaHorasExtraDto } from './dto/create-autoriza_horas_extra.dto';
import { UpdateAutorizaHorasExtraDto } from './dto/update-autoriza_horas_extra.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AutorizaHorasExtra } from './entities/autoriza_horas_extra.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AutorizaHorasExtrasService {
  constructor(
    @InjectRepository(AutorizaHorasExtra)
    private readonly autorizaHorasExtrasRepository: Repository<AutorizaHorasExtra>,
  ) { }
  create(createAutorizaHorasExtraDto: CreateAutorizaHorasExtraDto) {
    return 'This action adds a new autorizaHorasExtra';
  }

  findAll() {
    return this.autorizaHorasExtrasRepository.find({
      relations: ['cargo'],
      select: {
        cargo: {
          cargo_id: true,
          nombre: true,
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} autorizaHorasExtra`;
  }

  update(id: number, updateAutorizaHorasExtraDto: UpdateAutorizaHorasExtraDto) {
    return `This action updates a #${id} autorizaHorasExtra`;
  }

  remove(id: number) {
    return `This action removes a #${id} autorizaHorasExtra`;
  }
}
