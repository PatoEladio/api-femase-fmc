import { Injectable } from '@nestjs/common';
import { CreateAsignacionTurnoRotativoDto } from './dto/create-asignacion_turno_rotativo.dto';
import { UpdateAsignacionTurnoRotativoDto } from './dto/update-asignacion_turno_rotativo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionTurnoRotativo } from './entities/asignacion_turno_rotativo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsignacionTurnoRotativoService {
@InjectRepository(AsignacionTurnoRotativo)
private readonly asignacionTurnoRotativoRepository: Repository<AsignacionTurnoRotativo>;

  create(createAsignacionTurnoRotativoDto: CreateAsignacionTurnoRotativoDto) {
    const nuevo = this.asignacionTurnoRotativoRepository.create(createAsignacionTurnoRotativoDto);
    return this.asignacionTurnoRotativoRepository.save(nuevo);
  }

  findAll() {
    return this.asignacionTurnoRotativoRepository.find({
      relations: {
        empleado: true,
        turnoRotativo: true,
        horario: true,
      },
      order: {
        fecha_turno: "DESC"
      },
      select:{
        empleado:{
          nombres:true,
          apellido_paterno:true,
          apellido_materno:true,
          empleado_id:true,
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacionTurnoRotativo`;
  }

  update(id: number, updateAsignacionTurnoRotativoDto: UpdateAsignacionTurnoRotativoDto) {
    return `This action updates a #${id} asignacionTurnoRotativo`;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacionTurnoRotativo`;
  }
}
