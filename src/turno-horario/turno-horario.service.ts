import { Injectable } from '@nestjs/common';
import { CreateTurnoHorarioDto } from './dto/create-turno-horario.dto';
import { UpdateTurnoHorarioDto } from './dto/update-turno-horario.dto';

@Injectable()
export class TurnoHorarioService {
  create(createTurnoHorarioDto: CreateTurnoHorarioDto) {
    return 'This action adds a new turnoHorario';
  }

  findAll() {
    return `This action returns all turnoHorario`;
  }

  update(id: number, updateTurnoHorarioDto: UpdateTurnoHorarioDto) {
    return `This action updates a #${id} turnoHorario`;
  }

  remove(id: number) {
    return `This action removes a #${id} turnoHorario`;
  }
}
