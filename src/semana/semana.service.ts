import { Injectable } from '@nestjs/common';
import { CreateSemanaDto } from './dto/create-semana.dto';
import { UpdateSemanaDto } from './dto/update-semana.dto';

@Injectable()
export class SemanaService {
  create(createSemanaDto: CreateSemanaDto) {
    return 'This action adds a new semana';
  }

  findAll() {
    return `This action returns all semana`;
  }

  findOne(id: number) {
    return `This action returns a #${id} semana`;
  }

  update(id: number, updateSemanaDto: UpdateSemanaDto) {
    return `This action updates a #${id} semana`;
  }

  remove(id: number) {
    return `This action removes a #${id} semana`;
  }
}
