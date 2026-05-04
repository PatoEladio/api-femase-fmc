import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAusenciaDto } from './dto/create-ausencia.dto';
import { UpdateAusenciaDto } from './dto/update-ausencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ausencia } from './entities/ausencia.entity';
import { Between, Repository } from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';

@Injectable()
export class AusenciasService {
  constructor(
    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
  ) { }

  async create(createAusenciaDto: CreateAusenciaDto) {
    const existe = await this.ausenciaRepository.query(
      `SELECT * FROM db_fmc.ausencias WHERE num_ficha = $1 AND $2 BETWEEN fecha_inicio AND fecha_fin`,
      [createAusenciaDto.num_ficha, createAusenciaDto.fecha_inicio]
    );

    if (existe.length > 0) {
      throw new BadRequestException('Ya existe una ausencia en esa fecha');
    }
    return this.ausenciaRepository.save(createAusenciaDto as any);
  }

  async update(id: number, updateAusenciaDto: UpdateAusenciaDto) {
    const existe = await this.ausenciaRepository.findOneBy({ id });
    if (!existe) {
      throw new HttpException(
        `No se encontraron registros para la ausencia con id ${id}`,
        404
      );
    }
    const existeFecha = await this.ausenciaRepository.query(
      `SELECT * FROM db_fmc.ausencias WHERE num_ficha = $1 AND $2 BETWEEN fecha_inicio AND fecha_fin AND id != $3`,
      [updateAusenciaDto.num_ficha, updateAusenciaDto.fecha_inicio, id]
    );
    if (existeFecha.length > 0) {
      throw new BadRequestException('Ya existe una ausencia en esa fecha');
    }
    return this.ausenciaRepository.save({
      ...updateAusenciaDto,
      id: id
    } as any);
  }

  async findAll(numFicha: string, fecha_inicio?: Date, fecha_fin?: Date) {
    const where: any = {
      num_ficha: numFicha
    };

    if (fecha_inicio && fecha_fin) {
      where.fecha_fin = Between(fecha_inicio, fecha_fin);
    }

    const existe = await this.ausenciaRepository.find({
      order: {
        id: "ASC"
      },
      relations: ["tipo_ausencia"],
      select: {
        tipo_ausencia: {
          id: true,
          nombre: true
        }
      },
      where: where
    })

    if (existe.length === 0) {
      throw new HttpException(
        `No se encontraron registros para el empleado con ficha ${numFicha} en el rango indicado`,
        404
      );
    }
    return existe;
  }

  remove(id: number) {
    return `This action removes a #${id} ausencia`;
  }
}
