import { Injectable } from '@nestjs/common';
import { CreateErrorRechazoDto } from './dto/create-error-rechazo.dto';
import { UpdateErrorRechazoDto } from './dto/update-error-rechazo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorRechazo } from './entities/error-rechazo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ErrorRechazoService {

  constructor(
    @InjectRepository(ErrorRechazo)
    private readonly errorRechazoRepository: Repository<ErrorRechazo>,
  ) {}

  async create(createErrorRechazoDto: CreateErrorRechazoDto) {
    const nuevoErrorRechazo = await this.errorRechazoRepository.create(createErrorRechazoDto);
    return await this.errorRechazoRepository.save(nuevoErrorRechazo);
  }

  async obtenerErrorrechazos(){
    const busqueda = await this.errorRechazoRepository.find({
      order:{
        id: "ASC"
      }
    });
    if (busqueda.length === 0 ) {
      return {errorRechazo: []};
    }
    return {errorRechazo: busqueda};
  }

  findOne(id: number) {
    return `This action returns a #${id} errorRechazo`;
  }

  async update(id: number, updateErrorRechazoDto: UpdateErrorRechazoDto) {
    const errorRachazoActualizado = await this.errorRechazoRepository.update(id, updateErrorRechazoDto);
    return errorRachazoActualizado;
  }

  remove(id: number) {
    return `This action removes a #${id} errorRechazo`;
  }
}
