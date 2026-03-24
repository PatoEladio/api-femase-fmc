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
      relations: [
        'empleado',
        'dispositivo',
        'empleado.turno',
        'empleado.turno.detalle_turno',
        'empleado.turno.detalle_turno.horario',
        'empleado.turno.detalle_turno.dia',
        'tipo_marca'
      ],
      select: {
        id_marca: true,
        fecha_marca: true,
        hora_marca: true,
        evento: true,
        hashcode: true,
        info_adicional: true,
        comentario: true,
        tipo_marca: {
          tipo_marca_id: true,
          nombre: true,
        },
        empleado: {
          num_ficha: true,
          turno: {
            turno_id: true,
            detalle_turno: {
              id_detalle_turno: true,
              horario: {
                hora_entrada: true,
                hora_salida: true,
              },
            },
          }
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
      empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, {
        where: { num_ficha: numFicha },
        relations: ['turno', 'turno.detalle_turno', 'turno.detalle_turno.horario', 'turno.detalle_turno.dia']
      });
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
        const formateadas = marcasDelDia.map(m => {
          const dtDia = m.empleado?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);
          return {
            ...m,
            fecha_marca: dateKey as any,
            empleado: m.empleado ? {
              ...m.empleado,
              turno: m.empleado.turno ? {
                ...m.empleado.turno,
                detalle_turno: dtDia && dtDia.horario ? { horario: dtDia.horario } : null
              } : null
            } : null
          };
        });
        result.push(...formateadas);

        if (marcasDelDia.length === 1) {
          const marcaUnica = marcasDelDia[0];
          let infoFaltante = 'Falta Marca';
          if (marcaUnica.evento === 1) {
            infoFaltante = 'Falta Marca Salida';
          } else if (marcaUnica.evento === 2) {
            infoFaltante = 'Falta Marca Entrada';
          }

          const dtDia = empleadoInfo?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);
          result.push({
            id_marca: null,
            fecha_marca: dateKey as any,
            hora_marca: null,
            evento: null,
            hashcode: null,
            info_adicional: infoFaltante,
            dispositivo: null,
            empleado: {
              num_ficha: empleadoInfo?.num_ficha,
              turno: empleadoInfo?.turno ? {
                turno_id: empleadoInfo.turno.turno_id,
                detalle_turno: dtDia && dtDia.horario ? { horario: dtDia.horario } : null
              } : null
            },
          } as any);
        }
      } else {
        const dtDia = empleadoInfo?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);
        result.push({
          id_marca: null,
          fecha_marca: dateKey as any,
          hora_marca: null,
          evento: null,
          hashcode: null,
          info_adicional: tieneTurnoHoy ? 'Faltan ambas marcas ' : 'Día libre',
          dispositivo: null,
          tieneTurno: tieneTurnoHoy,
          empleado: {
            num_ficha: empleadoInfo?.num_ficha,
            turno: empleadoInfo?.turno ? {
              turno_id: empleadoInfo.turno.turno_id,
              detalle_turno: dtDia && dtDia.horario ? { horario: dtDia.horario } : null
            } : null
          },
        } as any);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    if (!updateMarcaDto || Object.keys(updateMarcaDto).length === 0) {
      throw new HttpException('No se proporcionaron los datos para actualizar la marca', 400);
    }

    const marca = await this.marcaRepository.findOne({ where: { id_marca: id } });

    if (!marca) {
      throw new HttpException('No se encontró la marca a actualizar', 404);
    }

    Object.assign(marca, updateMarcaDto);
    const guardar = await this.marcaRepository.save(marca);

    if (!guardar) {
      throw new HttpException('No se pudo actualizar la marca', 500);
    }

    return { message: 'Marca actualizada exitosamente', data: guardar };
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }
}
