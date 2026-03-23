import { HttpException, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Between, Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) { }

  async create(createMarcaDto: CreateMarcaDto) {
    if (!createMarcaDto) {
      throw new HttpException('No se proporcionaron los datos para crear la marca', 404);
    }
    const nuevaMarca = this.marcaRepository.create(createMarcaDto);
    const guardar = await this.marcaRepository.save(nuevaMarca);
    if (!guardar) {
      throw new HttpException('No se pudo crear la marca', 404);
    }
    return { message: 'Marca creada exitosamente', data: guardar };
  }

  async findAll(numFicha: string, fechaInicio: string, fechaFin: string) {
    const busqueda = await this.marcaRepository.find({
      where: {
        num_ficha: numFicha,
        fecha_marca: Between(fechaInicio as any, fechaFin as any),
      },
      order: {
        fecha_marca: 'ASC',
      },
      relations: ['empleado', 'dispositivo'],
      select: {
        id_marca: true,
        fecha_marca: true,
        hora_marca: true,
        evento: true,
        hashcode: true,
        info_adicional: true,
        empleado: {
          num_ficha: true,
        },
        dispositivo: {
          nombre: true,
        }
      }
    });

    const result: any[] = [];

    let empleadoInfo: Empleado | null = null;

    if (busqueda.length > 0 && busqueda[0].empleado) {
      empleadoInfo = busqueda[0].empleado;

    } else {
      empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, { where: { num_ficha: numFicha } });
    }

    if (!empleadoInfo) {
      throw new HttpException('No se pudo encontrar el empleado', 404);
    }

    const diasTurnoQuery = await this.marcaRepository.manager.query(
      `SELECT e.turno_id, dt.id_dia 
       FROM db_fmc.empleado e 
       LEFT JOIN db_fmc.detalle_turno dt ON dt.id_turno = e.turno_id 
       WHERE e.num_ficha = $1`,
      [numFicha]
    );

    let diasConTurno = [1, 2, 3, 4, 5, 6, 7];
    if (diasTurnoQuery && diasTurnoQuery.length > 0) {
      if (diasTurnoQuery[0].turno_id !== null) {
        diasConTurno = diasTurnoQuery.filter((row: any) => row.id_dia !== null).map((row: any) => row.id_dia);
      }
    }

    const startParts = fechaInicio.split('-');
    const currentDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));

    const endParts = fechaFin.split('-');
    const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      let diaSemana = currentDate.getDay();
      if (diaSemana === 0) diaSemana = 7;
      const tieneTurnoHoy = diasConTurno.includes(diaSemana);

      const marcasDelDia = busqueda.filter((m) => {
        let mDateKey = '';
        if (typeof m.fecha_marca === 'string') {
          mDateKey = (m.fecha_marca as string).substring(0, 10);
        } else if (m.fecha_marca) {
          const d = new Date(m.fecha_marca);
          mDateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
        return mDateKey === dateKey;
      });

      if (marcasDelDia.length > 0) {
        const formateadas = marcasDelDia.map(m => ({
          ...m,
          fecha_marca: dateKey as any
        }));
        result.push(...formateadas);

        if (marcasDelDia.length === 1) {
          const marcaUnica = marcasDelDia[0];
          let infoFaltante = 'Falta Marca';
          if (marcaUnica.evento === 1) {
            infoFaltante = 'Falta Marca Salida';
          } else if (marcaUnica.evento === 2) {
            infoFaltante = 'Falta Marca Entrada';
          }

          result.push({
            id_marca: null,
            fecha_marca: dateKey as any,
            hora_marca: null,
            evento: null,
            hashcode: null,
            info_adicional: infoFaltante,
            dispositivo: null,
            empleado: { num_ficha: empleadoInfo?.num_ficha },
          } as any);
        }
      } else {
        result.push({
          id_marca: null,
          fecha_marca: dateKey as any,
          hora_marca: null,
          evento: null,
          hashcode: null,
          info_adicional: tieneTurnoHoy ? 'Sin marca' : 'Día libre',
          dispositivo: null,
          empleado: { num_ficha: empleadoInfo?.num_ficha },
        } as any);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  update(id: number, updateMarcaDto: UpdateMarcaDto) {
    return `This action updates a #${id} marca`;
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }
}
