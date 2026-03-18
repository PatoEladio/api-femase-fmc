import { Injectable } from '@nestjs/common';
import { CreateDetalleTurnoDto } from './dto/create-detalle-turno.dto';
import { UpdateDetalleTurnoDto } from './dto/update-detalle-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleTurno } from './entities/detalle-turno.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetalleTurnoService {

  constructor(
    @InjectRepository(DetalleTurno)
    private readonly detalleTurnoRepository: Repository<DetalleTurno>,
  ) {}

  create(createDetalleTurnoDto: CreateDetalleTurnoDto) {
    const nuevoDetalleTurno = this.detalleTurnoRepository.create(createDetalleTurnoDto);
    return this.detalleTurnoRepository.save(nuevoDetalleTurno);
  }

  findAll() {
    return `This action returns all detalleTurno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleTurno`;
  }

  update(id: number, updateDetalleTurnoDto: UpdateDetalleTurnoDto) {
    return `This action updates a #${id} detalleTurno`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleTurno`;
  }
}
