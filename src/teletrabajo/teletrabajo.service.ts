import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeletrabajoDto } from './dto/create-teletrabajo.dto';
import { UpdateTeletrabajoDto } from './dto/update-teletrabajo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teletrabajo } from './entities/teletrabajo.entity';
import { Repository } from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';
import { AsignacionTurnoRotativo } from 'src/asignacion_turno_rotativo/entities/asignacion_turno_rotativo.entity';

@Injectable()
export class TeletrabajoService {
  constructor(
    @InjectRepository(Teletrabajo)
    private readonly teletrabajoRepository: Repository<Teletrabajo>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(DetalleTurno)
    private readonly detalleTurnoRepository: Repository<DetalleTurno>,
    @InjectRepository(AsignacionTurnoRotativo)
    private readonly asignacionTurnoRotativoRepository: Repository<AsignacionTurnoRotativo>,
  ) { }



  async asignarTeletrabajo(idEmpleado: number, fecha_inicio: string, fecha_fin: string) {
    const empleado = await this.empleadoRepository.findOne({ where: { empleado_id: idEmpleado }, relations: { turno: true } })
    if (!empleado) {
      throw new NotFoundException("Empleado no encontrado")
    }
    if (fecha_inicio > fecha_fin) {
      throw new NotFoundException("La fecha de inicio debe ser menor a la fecha de fin")
    }

    const getFechaLocal = (f: any) => {
      if (typeof f === 'string' && f.includes('-')) {
        const parts = f.split('T')[0].split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            return new Date(y, m - 1, d, 0, 0, 0, 0);
        }
      }
      const d = new Date(f); 
      const dateLocal = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
      return dateLocal;
    };

    let fechaActual = getFechaLocal(fecha_inicio);
    const fechaTermino = getFechaLocal(fecha_fin);

    //tiene turno Normal
    if (!empleado?.permite_rotativo && empleado?.turno) {
      const id_turno = empleado.turno?.turno_id
      const datos = await this.detalleTurnoRepository.find({
        where: { turno: { turno_id: id_turno } },
        relations: {
          dia: true,
          horario: true,
          turno: true
        }
      })

      if (datos.length === 0) {
        throw new NotFoundException("El turno no cuenta con horarios asignados");
      }

      const resultados: Teletrabajo[] = [];

      while (fechaActual.getTime() <= fechaTermino.getTime()) {
        const diaNum = fechaActual.getDay() || 7;

        const detalleDia = datos.find(d => d.dia.cod_dia === diaNum);
        if (detalleDia) {
          const existe = await this.teletrabajoRepository.findOne({
            where: {
              id_empleado: { empleado_id: idEmpleado },
              fecha_actual: fechaActual
            }
          });
          if (!existe) {
            const nuevoRegistro = this.teletrabajoRepository.create({
              id_empleado: empleado,
              fecha_actual: new Date(fechaActual),
              horario_id: { horario_id: detalleDia.horario.horario_id } as any
            });
            const guardado = await this.teletrabajoRepository.save(nuevoRegistro);
            resultados.push(guardado);
          } else {
            throw new NotFoundException(`Ya existe un registro de teletrabajo en la fecha ${fechaActual.toISOString().split('T')[0]}`)
          }
        }

        fechaActual.setDate(fechaActual.getDate() + 1);
        fechaActual.setHours(0, 0, 0, 0);
      }
      return {
        message: `Se procesaron los días. Registros creados: ${resultados.length}`,
        detalles: resultados
      };
    }


    //Tiene turno Rotativo
    if (empleado?.permite_rotativo && !empleado?.turno) {
      const datos = await this.asignacionTurnoRotativoRepository.find({
        where: { empleado: { empleado_id: idEmpleado } },
        relations: {
          horario: true,
        }
      })
      const resultadosModificados: AsignacionTurnoRotativo[] = []

      while (fechaActual.getTime() <= fechaTermino.getTime()) {
        const fechaBucle = fechaActual.toLocaleDateString('en-CA');

        const registroActual = datos.find((item) => item.fecha_inicio_turno.toISOString().split('T')[0] === fechaBucle);
        if (registroActual) {
          await this.asignacionTurnoRotativoRepository.update(registroActual?.id, {
            teletrabajo: true
          })
          resultadosModificados.push(registroActual)
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
        fechaActual.setHours(0, 0, 0, 0);
      }
      return {
        message: `Teletrabajo asignado correctamente`,
        detalles: resultadosModificados
      };
    }

    //No tiene turno
    if (!empleado?.permite_rotativo && !empleado?.turno) {
      throw new NotFoundException("No tiene turno asignado")
    }
  }

 
  async tieneTeletrabajo(runEmpleado: string) {
    const empleados = await this.empleadoRepository.find({
      where: { run: runEmpleado }
    });
    if (empleados.length === 0) {
      throw new NotFoundException("Empleado no encontrado");
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    for (const emp of empleados) {
      const teletrabajo = await this.teletrabajoRepository.findOne({
        where: {
          id_empleado: { empleado_id: emp.empleado_id },
          fecha_actual: hoy 
        }
      });
      if (teletrabajo) return teletrabajo;
      const rotativoAsignado = await this.asignacionTurnoRotativoRepository.findOne({
        where: {
          empleado: { empleado_id: emp.empleado_id },
          teletrabajo: true,
          fecha_inicio_turno: hoy 
        }
      });
      if (rotativoAsignado) return rotativoAsignado;
    }
    throw new NotFoundException("No tiene teletrabajo asignado para el día de hoy");
  }
}
