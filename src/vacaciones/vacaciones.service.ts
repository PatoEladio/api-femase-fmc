import { HttpException, Injectable } from '@nestjs/common';
import { CreateVacacioneDto } from './dto/create-vacacione.dto';
import { UpdateVacacioneDto } from './dto/update-vacacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacaciones } from './entities/vacaciones.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class VacacionesService {
  constructor(
    @InjectRepository(Vacaciones)
    private readonly vacacionesRepository: Repository<Vacaciones>,
  ) { }

  create(createVacacioneDto: CreateVacacioneDto) {
    return 'This action adds a new vacacione';
  }

  async findAll(numFicha: string, fechaInicio?: Date, fechaFin?: Date) {
    let whereConditions: any = {
      empleado: { num_ficha: numFicha }
    };

    if (fechaInicio && fechaFin) {
      whereConditions = [
        { empleado: { num_ficha: numFicha }, fecha_inicio: Between(fechaInicio, fechaFin) },
        { empleado: { num_ficha: numFicha }, fecha_fin: Between(fechaInicio, fechaFin) }
      ];
    }

    const busqueda = await this.vacacionesRepository.find({
      where: whereConditions,
      relations: ['empleado'],
      select: {
        id_vacaciones: true,
        fecha_ingreso: true,
        fecha_inicio: true,
        fecha_fin: true,
        dias_acumulados: true,
        dias_efectivos: true,
        saldo_vacaciones: true,
        zona_extrema: true,
        autorizador: true,
        estado: true,
        empleado: {
          num_ficha: true,
          fecha_ini_contrato: true,
          fecha_fin_contrato: true,
        }
      }
    });

    if (busqueda.length === 0) {
      throw new HttpException('No se encontraron vacaciones para el número de ficha proporcionado o en el rango de fechas seleccionado', 404);
    }

    if (busqueda[0].empleado.fecha_fin_contrato) {
      const fechaFinContrato = new Date(busqueda[0].empleado.fecha_fin_contrato);
      if (fechaFinContrato < new Date()) {
        throw new HttpException('El empleado tiene contrato vencido', 400);
      }
    }

    let multiplicadorDias: number;

    if (busqueda[0].zona_extrema) {
      multiplicadorDias = 1.67;
    } else {
      multiplicadorDias = 1.25;
    }

    const fechaInicioContrato = new Date(busqueda[0].empleado.fecha_ini_contrato);
    const fechaActual = new Date();
    
    let mesesTrabajados = (fechaActual.getFullYear() - fechaInicioContrato.getFullYear()) * 12 + (fechaActual.getMonth() - fechaInicioContrato.getMonth());
    
    if (fechaActual.getDate() < fechaInicioContrato.getDate()) {
      mesesTrabajados--;
    }
    
    if (mesesTrabajados < 0) mesesTrabajados = 0;

    const diasAcumulados = mesesTrabajados * multiplicadorDias;

    busqueda.forEach(b => {
      b.dias_acumulados = parseFloat(diasAcumulados.toFixed(2));

      if (b.fecha_inicio && b.fecha_fin) {
        const startDate = new Date(b.fecha_inicio);
        const endDate = new Date(b.fecha_fin);
        
        let diasEfectivos = 0;
        const current = new Date(startDate.getTime());

        while (current <= endDate) {
          const dayOfWeek = current.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            diasEfectivos++;
          }
          current.setDate(current.getDate() + 1);
        }
        
        b.dias_efectivos = diasEfectivos;
        b.saldo_vacaciones = parseFloat((b.dias_acumulados - b.dias_efectivos).toFixed(2));
      }
    });

    return busqueda;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacacione`;
  }

  update(id: number, updateVacacioneDto: UpdateVacacioneDto) {
    return `This action updates a #${id} vacacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacacione`;
  }
}
