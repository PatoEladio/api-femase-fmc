import { HttpException, Injectable } from '@nestjs/common';
import { CreateTurnosRotativoDto } from './dto/create-turnos-rotativo.dto';
import { UpdateTurnosRotativoDto } from './dto/update-turnos-rotativo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnosRotativo } from './entities/turnos-rotativo.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TurnosRotativosService {
@InjectRepository(TurnosRotativo)
private readonly turnosRotativosRepository: Repository<TurnosRotativo>;

  create(createTurnosRotativoDto: CreateTurnosRotativoDto) {
    const nuevoTurnoRotativo = this.turnosRotativosRepository.create(createTurnosRotativoDto);
    this.turnosRotativosRepository.save(nuevoTurnoRotativo);
    return { message: "Turno rotativo creado exitosamente" }
  }

  findAll() {
    const turnosRotativos = this.turnosRotativosRepository.find({
      order: {
        id: 'ASC'
      },
      relations: ['empresa', 'estado']
    });
    return turnosRotativos;
  }

  findOne(id: number) {
    return `This action returns a #${id} turnosRotativo`;
  }

  async update(id: number, updateTurnosRotativoDto: UpdateTurnosRotativoDto) {
    const turnoRotativo = await this.turnosRotativosRepository.preload({
      id:id,
      ...updateTurnosRotativoDto
    })

    if(!turnoRotativo){
      throw new HttpException("Turno No Encontrado", 404)
    }

   try{
    const turnoActualizado = await this.turnosRotativosRepository.save(turnoRotativo)
    return {
      message: "Turno rotativo actualizado exitosamente",
      id: turnoActualizado.id
    }
   }catch(error){
    throw new HttpException("Error al actualizar el turno rotativo", 500)
   }
  }

  remove(id: number) {
    return `This action removes a #${id} turnosRotativo`;
  }
}
