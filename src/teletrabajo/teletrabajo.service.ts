import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeletrabajoDto } from './dto/create-teletrabajo.dto';
import { UpdateTeletrabajoDto } from './dto/update-teletrabajo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teletrabajo } from './entities/teletrabajo.entity';
import { Repository } from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';
import { AsignacionTurnoRotativo } from 'src/asignacion_turno_rotativo/entities/asignacion_turno_rotativo.entity';
import { Empresa } from 'src/empresas/empresas.entity';

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
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
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

      const diasAProcesar: { fecha: Date; detalle: any }[] = [];
      let fechaValidacion = new Date(fechaActual);

      //Validar todas las fechas en el rango
      while (fechaValidacion.getTime() <= fechaTermino.getTime()) {
        const diaNum = fechaValidacion.getDay() || 7;
        const detalleDia = datos.find((d) => d.dia.cod_dia === diaNum);

        if (detalleDia) {
          const existe = await this.teletrabajoRepository.findOne({
            where: {
              id_empleado: { empleado_id: idEmpleado },
              fecha_actual: new Date(fechaValidacion),
            },
          });

          if (existe) {
            throw new NotFoundException(
              `Ya existe un registro de teletrabajo en la fecha ${fechaValidacion.toLocaleDateString('en-CA')}`,
            );
          }

          diasAProcesar.push({
            fecha: new Date(fechaValidacion),
            detalle: detalleDia,
          });
        }

        fechaValidacion.setDate(fechaValidacion.getDate() + 1);
        fechaValidacion.setHours(0, 0, 0, 0);
      }

      const resultados: Teletrabajo[] = [];

      //Crear los registros solo si todas las validaciones pasaron
      for (const item of diasAProcesar) {
        const nuevoRegistro = this.teletrabajoRepository.create({
          id_empleado: empleado,
          fecha_actual: item.fecha,
          horario_id: { horario_id: item.detalle.horario.horario_id } as any,
        });
        const guardado = await this.teletrabajoRepository.save(nuevoRegistro);
        resultados.push(guardado);
      }

      return {
        message: `Se procesaron los días. Registros creados: ${resultados.length}`,
        detalles: resultados,
      };
    }


    //Tiene turno Rotativo
    if (empleado?.permite_rotativo && !empleado?.turno) {
      const datos = await this.asignacionTurnoRotativoRepository.find({
        where: { empleado: { empleado_id: idEmpleado } },
        relations: {
          horario: true,
        },
      });
      const resultadosModificados: AsignacionTurnoRotativo[] = [];
      let fechaValidacion = new Date(fechaActual);

      //Validar todas las fechas en el rango
      while (fechaValidacion.getTime() <= fechaTermino.getTime()) {
        const fechaBucle = fechaValidacion.toLocaleDateString('en-CA');

        const registroActual = datos.find(
          (item) =>
            item.fecha_inicio_turno.toISOString().split('T')[0] === fechaBucle,
        );

        if (registroActual) {
          if (registroActual.teletrabajo) {
            throw new NotFoundException(
              `Ya existe un registro de teletrabajo en la fecha ${fechaBucle}`,
            );
          }

          resultadosModificados.push(registroActual);
        }
        fechaValidacion.setDate(fechaValidacion.getDate() + 1);
        fechaValidacion.setHours(0, 0, 0, 0);
      }

      //Actualizar registros solo si todas las validaciones pasaron
      for (const registro of resultadosModificados) {
        await this.asignacionTurnoRotativoRepository.update(registro.id, {
          teletrabajo: true,
        });
      }

      return {
        message: `Teletrabajo asignado correctamente`,
        detalles: resultadosModificados,
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

  async obtenerTeletrabajos(idEmpresa: number) {
    const empresa = await this.empresaRepository.findOne({ where: { empresa_id: idEmpresa } });
    if (!empresa) {
      throw new NotFoundException("Empresa no encontrada");
    }

    // Buscamos todos los empleados de la empresa
    const empleados = await this.empleadoRepository.find({
      where: { empresa: { empresa_id: idEmpresa } },
      relations: { 
        turno: true,
        cenco: true 
      }
    });

    const resultados: any[] = [];

    for (const emp of empleados) {
      let teletrabajosNormales: Teletrabajo[] = [];
      let teletrabajosRotativos: AsignacionTurnoRotativo[] = [];

      // 1. Teletrabajo en turno normal (registros en tabla teletrabajo)
      if (!emp.permite_rotativo && emp.turno) {
        teletrabajosNormales = await this.teletrabajoRepository.find({
          where: { id_empleado: { empleado_id: emp.empleado_id } },
          relations: ['horario_id']
        });
      }

      // 2. Teletrabajo en turno rotativo (campo teletrabajo en asignacion_turno_rotativo)
      if (emp.permite_rotativo) {
        teletrabajosRotativos = await this.asignacionTurnoRotativoRepository.find({
          where: { 
            empleado: { empleado_id: emp.empleado_id }, 
            teletrabajo: true 
          },
          relations: ['horario']
        });
      }

      // Si el empleado tiene al menos un registro de teletrabajo, lo incluimos en la respuesta
      if (teletrabajosNormales.length > 0 || teletrabajosRotativos.length > 0) {
        resultados.push({
          ...emp,
          teletrabajo_normal: teletrabajosNormales,
          teletrabajo_rotativo: teletrabajosRotativos
        });
      }
    }

    return resultados;
  }

  async editarTeletrabajo(idEmpleado: number, id: number, horarioId: number) {
    // 1. Cargamos al empleado con su relación de turno para saber qué tipo de horario usa
    const empleado = await this.empleadoRepository.findOne({
      where: { empleado_id: idEmpleado },
      relations: { turno: true }
    });

    if (!empleado) {
      throw new NotFoundException("Empleado no encontrado");
    }

    // --- CASO: TURNO NORMAL ---
    if (!empleado.permite_rotativo && empleado.turno) {
      const teletrabajo = await this.teletrabajoRepository.findOne({
        where: { 
          id: id,
          id_empleado: { empleado_id: idEmpleado } 
        }
      });

      if (!teletrabajo) {
        throw new NotFoundException("Registro de teletrabajo no encontrado");
      }

      const update = await this.teletrabajoRepository.update(id, {
        horario_id: { horario_id: horarioId } as any,
      });

      return {
        message: "Teletrabajo (Normal) actualizado correctamente",
        update
      };
    }

    // --- CASO: TURNO ROTATIVO ---
    if (empleado.permite_rotativo) {
      const turnoRotativo = await this.asignacionTurnoRotativoRepository.findOne({
        where: { 
          id: id,
          empleado: { empleado_id: idEmpleado } 
        }
      });

      if (!turnoRotativo) {
        throw new NotFoundException("Asignación de turno rotativo no encontrada");
      }

      const update = await this.asignacionTurnoRotativoRepository.update(id, {
        horario: { horario_id: horarioId } as any
      });

      return {
        message: "Turno rotativo actualizado correctamente",
        update
      };
    }

    throw new NotFoundException("El empleado no tiene un tipo de turno válido para editar");
  }

  async eliminarTeletrabajo(idEmpleado: number, id: number) {
    // 1. Identificamos al empleado y su tipo de turno
    const empleado = await this.empleadoRepository.findOne({
      where: { empleado_id: idEmpleado },
      relations: { turno: true }
    });

    if (!empleado) {
      throw new NotFoundException("Empleado no encontrado");
    }

    // --- CASO: TURNO NORMAL ---
    if (!empleado.permite_rotativo && empleado.turno) {
      const teletrabajo = await this.teletrabajoRepository.findOne({
        where: { 
          id: id,
          id_empleado: { empleado_id: idEmpleado } 
        }
      });

      if (!teletrabajo) {
        throw new NotFoundException("Registro de teletrabajo no encontrado");
      }

      await this.teletrabajoRepository.delete(id);
      return { message: "Registro de teletrabajo eliminado correctamente" };
    }

    // --- CASO: TURNO ROTATIVO ---
    if (empleado.permite_rotativo) {
      const turnoRotativo = await this.asignacionTurnoRotativoRepository.findOne({
        where: { 
          id: id,
          empleado: { empleado_id: idEmpleado } 
        }
      });

      if (!turnoRotativo) {
        throw new NotFoundException("Asignación de turno rotativo no encontrada");
      }

      await this.asignacionTurnoRotativoRepository.update(id, {
        teletrabajo: false
      });

      return { message: "Teletrabajo removido del turno rotativo correctamente" };
    }

    throw new NotFoundException("No se pudo determinar el tipo de turno para eliminar");
  }

    
}
