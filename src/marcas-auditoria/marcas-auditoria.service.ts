import { Injectable } from '@nestjs/common';
import { CreateMarcasAuditoriaDto } from './dto/create-marcas-auditoria.dto';
import { UpdateMarcasAuditoriaDto } from './dto/update-marcas-auditoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcasAuditoria } from './entities/marcas-auditoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MarcasAuditoriaService {
  constructor(
    @InjectRepository(MarcasAuditoria)
    private readonly marcasAuditoriaRepository: Repository<MarcasAuditoria>,
  ) { }

  create(createMarcasAuditoriaDto: CreateMarcasAuditoriaDto) {
    return 'This action adds a new marcasAuditoria';
  }

  findAll(idMarca: number) {
    if (!idMarca) {
      return [];
    }

    return this.marcasAuditoriaRepository.find({
      where: {
        id_marca: idMarca
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} marcasAuditoria`;
  }

  update(id: number, updateMarcasAuditoriaDto: UpdateMarcasAuditoriaDto) {
    return `This action updates a #${id} marcasAuditoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} marcasAuditoria`;
  }
}
