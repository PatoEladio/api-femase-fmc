import { HttpException, Injectable } from '@nestjs/common';
import { CreateVacacioneDto } from './dto/create-vacacione.dto';
import { UpdateVacacioneDto } from './dto/update-vacacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacaciones } from './entities/vacaciones.entity';
import { Between, Repository } from 'typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';
import { User } from '../users/user.entity';

@Injectable()
export class VacacionesService {
  constructor(
    @InjectRepository(Vacaciones)
    private readonly vacacionesRepository: Repository<Vacaciones>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) { }

  create(createVacacioneDto: CreateVacacioneDto) {
    return 'This action adds a new vacacione';
  }

  async aprobarRechazarSolicitud(idSolicitud: number, estado: string, usuario: string) {
    const busquedaSolicitud = await this.vacacionesRepository.findOne({
      where: {
        id_vacaciones: idSolicitud
      }, relations: ['empleado']
    });

    if (!busquedaSolicitud) {
      throw new HttpException('Solicitud no encontrada', 404);
    }

    const autorizador = await this.usuarioRepository.findOne({
      where: {
        username: usuario
      }
    })

    if (!autorizador) {
      throw new HttpException('Autorizador no encontrado', 404);
    }

    busquedaSolicitud.estado = estado;
    busquedaSolicitud.autorizador = autorizador.username;

    const { diasDisponibles } = await this.getDiasDisponibles(busquedaSolicitud.empleado.num_ficha);

    busquedaSolicitud.saldo_vba_previo = busquedaSolicitud.saldo_vacaciones;

    // Calcular en rango fecha inicio y fin dias que hay entre medio sin contar fines de semana 
    const startDate = new Date(busquedaSolicitud.fecha_inicio);
    const endDate = new Date(busquedaSolicitud.fecha_fin);

    let diasUtilizados = 0;
    const current = new Date(startDate.getTime());

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        diasUtilizados++;
      }
      current.setDate(current.getDate() + 1);
    }

    busquedaSolicitud.dias_efectivos = diasUtilizados;
    busquedaSolicitud.saldo_vacaciones = diasDisponibles - busquedaSolicitud.dias_efectivos;

    return this.vacacionesRepository.save(busquedaSolicitud);
  }

  async getDiasDisponibles(numFicha: string) {
    const busquedaEmpleado = await this.empleadoRepository.findOne({
      where: {
        num_ficha: numFicha
      }, relations: ['cenco']
    });

    if (!busquedaEmpleado) {
      throw new HttpException('Empleado no encontrado', 404);
    }

    const busquedaVacaciones = await this.vacacionesRepository.find({
      where: {
        empleado: {
          num_ficha: busquedaEmpleado?.num_ficha
        },
        estado: 'A'
      },
      relations: ['empleado'],
      select: {
        id_vacaciones: true,
        fecha_ingreso: true,
        fecha_inicio: true,
        fecha_fin: true,
        dias_acumulados: true,
        dias_efectivos: true,
        saldo_vacaciones: true,
        saldo_vba_previo: true,
        zona_extrema: true,
        autorizador: true,
        estado: true,
        empleado: {
          num_ficha: true,
          fecha_ini_contrato: true,
          fecha_fin_contrato: true,
        }
      },
      order: {
        fecha_ingreso: 'DESC'
      }
    });

    const fechaInicioContrato = new Date(busquedaEmpleado.fecha_ini_contrato);
    fechaInicioContrato.setHours(0, 0, 0, 0);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    let mesesTrabajados = (fechaActual.getFullYear() - fechaInicioContrato.getFullYear()) * 12 + (fechaActual.getMonth() - fechaInicioContrato.getMonth());

    if (fechaActual.getDate() < fechaInicioContrato.getDate()) {
      mesesTrabajados--;
    }
    if (mesesTrabajados < 0) mesesTrabajados = 0;

    const diasDelMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
    let fechaUltimoCumpleMes = new Date(fechaInicioContrato);
    fechaUltimoCumpleMes.setMonth(fechaInicioContrato.getMonth() + mesesTrabajados);

    const diffTime = fechaActual.getTime() - fechaUltimoCumpleMes.getTime();
    const diasSueltos = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const proporcionalesNormales = (1.25 / diasDelMesActual) * diasSueltos;
    const totalNormales = (mesesTrabajados * 1.25) + proporcionalesNormales;

    let totalZonaExtrema = 0;
    if (busquedaEmpleado.cenco?.zona_extrema) {
      const proporcionalesZE = (0.42 / diasDelMesActual) * diasSueltos;
      totalZonaExtrema = (mesesTrabajados * 0.42) + proporcionalesZE;
    }

    const diasAcumulados = parseFloat((totalNormales + totalZonaExtrema).toFixed(2));

    const diasUtilizados = busquedaVacaciones.reduce((acc, curr) => acc + Number(curr.dias_efectivos || 0), 0);
    const diasDisponibles = parseFloat((diasAcumulados - diasUtilizados).toFixed(2));

    return {
      diasDisponibles,
      totalNormales: parseFloat(totalNormales.toFixed(2)),
      totalZonaExtrema: parseFloat(totalZonaExtrema.toFixed(2)),
      totalAcumulados: diasAcumulados,
      diasUtilizados: parseFloat(diasUtilizados.toFixed(2))
    };
  }

  async createSolicitudVacaciones(createVacacioneDto: CreateVacacioneDto, numFicha: string) {
    const { fechaInicio, fechaFin } = createVacacioneDto;
    const empleado = await this.empleadoRepository.findOne({
      where: { num_ficha: numFicha }
      , relations: ['cenco']
    });

    if (!empleado) {
      throw new HttpException('Empleado no encontrado', 404);
    }

    // Pasar a cantidad dias entre medio sin fin de semanas
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    let diasATomar = 0;
    const current = new Date(startDate.getTime());

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        diasATomar++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Obtener dias disponibles (ultimo registro del usuario)
    const { diasDisponibles } = await this.getDiasDisponibles(numFicha);


    if (diasDisponibles < diasATomar) {
      throw new HttpException('No tienes suficientes dias disponibles', 400);
    }

    let multiplicadorDias: number;

    if (empleado.cenco.zona_extrema) {
      multiplicadorDias = 1.67;
    } else {
      multiplicadorDias = 1.25;
    }

    // Se debe calcular en base a la fecha de inicio de contrato y fecha de inicio de vacaciones.
    const fechaInicioContrato = new Date(empleado.fecha_ini_contrato);
    fechaInicioContrato.setHours(0, 0, 0, 0);
    const fechaActual = new Date(fechaInicio);
    fechaActual.setHours(0, 0, 0, 0);

    let mesesTrabajados = (fechaActual.getFullYear() - fechaInicioContrato.getFullYear()) * 12 + (fechaActual.getMonth() - fechaInicioContrato.getMonth());

    if (fechaActual.getDate() < fechaInicioContrato.getDate()) {
      mesesTrabajados--;
    }

    if (mesesTrabajados < 0) mesesTrabajados = 0;

    const diasDelMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();

    let fechaUltimoCumpleMes = new Date(fechaInicioContrato);
    fechaUltimoCumpleMes.setMonth(fechaInicioContrato.getMonth() + mesesTrabajados);

    const diffTime = fechaActual.getTime() - fechaUltimoCumpleMes.getTime();
    const diasSueltos = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const diasProporcionales = (multiplicadorDias / diasDelMesActual) * diasSueltos;
    let diasAcumulados = (mesesTrabajados * multiplicadorDias) + diasProporcionales;

    diasAcumulados = parseFloat(diasAcumulados.toFixed(2));

    const vacaciones = this.vacacionesRepository.create({
      empleado: empleado,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: 'P',
      dias_acumulados: diasAcumulados,
      zona_extrema: empleado.cenco.zona_extrema,
      saldo_vba_previo: 0,
    });

    return this.vacacionesRepository.save(vacaciones);
  }

  async findAll(numFicha: string, fechaInicio?: Date, fechaFin?: Date) {
    let whereConditions: any = {
      empleado: { num_ficha: numFicha },
      estado: 'A'
    };

    if (fechaInicio && fechaFin) {
      whereConditions = [
        { empleado: { num_ficha: numFicha }, fecha_inicio: Between(fechaInicio, fechaFin), estado: 'A' },
        { empleado: { num_ficha: numFicha }, fecha_fin: Between(fechaInicio, fechaFin), estado: 'A' }
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
    fechaInicioContrato.setHours(0, 0, 0, 0);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    let mesesTrabajados = (fechaActual.getFullYear() - fechaInicioContrato.getFullYear()) * 12 + (fechaActual.getMonth() - fechaInicioContrato.getMonth());

    if (fechaActual.getDate() < fechaInicioContrato.getDate()) {
      mesesTrabajados--;
    }

    if (mesesTrabajados < 0) mesesTrabajados = 0;

    const diasDelMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
    let fechaUltimoCumpleMes = new Date(fechaInicioContrato);
    fechaUltimoCumpleMes.setMonth(fechaInicioContrato.getMonth() + mesesTrabajados);

    const diffTime = fechaActual.getTime() - fechaUltimoCumpleMes.getTime();
    const diasSueltos = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const proporcionalesNormales = (1.25 / diasDelMesActual) * diasSueltos;
    const totalNormales = (mesesTrabajados * 1.25) + proporcionalesNormales;

    let totalZonaExtrema = 0;
    if (busqueda[0].zona_extrema) {
      const proporcionalesZE = (0.42 / diasDelMesActual) * diasSueltos;
      totalZonaExtrema = (mesesTrabajados * 0.42) + proporcionalesZE;
    }

    const diasAcumulados = totalNormales + totalZonaExtrema;

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

    let diasUtilizados = 0;
    for (const v of busqueda) {
      diasUtilizados += Number(v.dias_efectivos || 0);
    }
    const diasDisponibles = parseFloat((diasAcumulados - diasUtilizados).toFixed(2));

    return {
      vacaciones: busqueda,
      resumen: {
        totalNormales: parseFloat(totalNormales.toFixed(2)),
        totalZonaExtrema: parseFloat(totalZonaExtrema.toFixed(2)),
        totalAcumulados: parseFloat(diasAcumulados.toFixed(2)),
        diasUtilizados: parseFloat(diasUtilizados.toFixed(2)),
        diasDisponibles: diasDisponibles
      }
    };
  }

  update(id: number, updateVacacioneDto: UpdateVacacioneDto) {
    return `This action updates a #${id} vacacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacacione`;
  }
}
