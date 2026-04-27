import { Injectable } from '@nestjs/common';
import { CreateHorasLegaleDto } from './dto/create-horas_legale.dto';
import { UpdateHorasLegaleDto } from './dto/update-horas_legale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HorasLegale } from './entities/horas_legale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HorasLegalesService {

  constructor(
    @InjectRepository(HorasLegale)
    private readonly horasRepository: Repository<HorasLegale>
  ) { }
  create(createHorasLegaleDto: CreateHorasLegaleDto) {


    return 'This action adds a new horasLegale';
  }

  async findAll() {
    const horarios = await this.horasRepository.find();
    return horarios;
  }

  findOne(id: number) {
    return `This action returns a #${id} horasLegale`;
  }

  async update(id: number, updateHorasLegaleDto: UpdateHorasLegaleDto) {
    const nuevo = await this.horasRepository.update(id, updateHorasLegaleDto);
    return nuevo;
  }

  remove(id: number) {
    return `This action removes a #${id} horasLegale`;
  }
}
