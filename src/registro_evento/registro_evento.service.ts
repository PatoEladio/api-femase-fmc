import { Injectable } from '@nestjs/common';
import { CreateRegistroEventoDto } from './dto/create-registro_evento.dto';
import { UpdateRegistroEventoDto } from './dto/update-registro_evento.dto';

@Injectable()
export class RegistroEventoService {
  create(createRegistroEventoDto: CreateRegistroEventoDto) {
    return 'This action adds a new registroEvento';
  }

  findAll() {
    return `This action returns all registroEvento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registroEvento`;
  }

  update(id: number, updateRegistroEventoDto: UpdateRegistroEventoDto) {
    return `This action updates a #${id} registroEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} registroEvento`;
  }
}
