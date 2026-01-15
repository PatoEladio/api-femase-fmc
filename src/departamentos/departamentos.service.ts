import { Get, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './departamento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>
  ) { }

  @Get('')
  async buscarTodosLosDepartamentos(): Promise<Departamento[]> {
    const busqueda = this.departamentoRepository.find();

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se han encontrado departamentos', 400);
    }
  }
}
