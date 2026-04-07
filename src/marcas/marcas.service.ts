import { HttpException, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Between, Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';
import { MarcasAuditoria } from '../marcas-auditoria/entities/marcas-auditoria.entity';
import { Feriado } from '../feriados/entities/feriado.entity';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { Cenco } from 'src/cencos/cenco.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';
import { AutorizaHorasExtra } from 'src/autoriza_horas_extras/entities/autoriza_horas_extra.entity';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
    @InjectRepository(MarcasAuditoria)
    private marcasAuditoriaRepository: Repository<MarcasAuditoria>,
    @InjectRepository(Feriado)
    private readonly feriadosRepository: Repository<Feriado>,
    private readonly mailerService: MailerService,
    @InjectRepository(AutorizaHorasExtra)
    private readonly autorizaHorasExtrasRepository: Repository<AutorizaHorasExtra>,
  ) { }

  async create(createMarcaDto: CreateMarcaDto) {
    if (!createMarcaDto) {
      throw new HttpException('No se proporcionaron los datos para crear la marca', 404);
    }
    const nuevaMarca = this.marcaRepository.create(createMarcaDto);

    nuevaMarca.hashcode = crypto.createHash('md5').update(JSON.stringify(nuevaMarca.evento + ';' + nuevaMarca.fecha_marca + ';' + nuevaMarca.hora_marca + ';' + nuevaMarca.num_ficha + ';' + nuevaMarca.id_tipo_marca + ';' + nuevaMarca.info_adicional + ';' + nuevaMarca.comentario)).digest('hex');

    //LOGICA DE CREACION DE FILA EN TABLA AUTORIZA_HORA_EXTRA

    // 1 busca la marca
    if (nuevaMarca.evento === 2) {
      const existeMarcaEntrada = await this.marcaRepository.findOne({
        where: {
          num_ficha: nuevaMarca.num_ficha,
          fecha_marca: nuevaMarca.fecha_marca,
          evento: 1
        }
      })
      // si la encuentra, busca al empleado de esa marca
      if (existeMarcaEntrada) {
        const empleado = await this.marcaRepository.manager.findOne(Empleado, {
          where: { num_ficha: nuevaMarca.num_ficha }, relations: [
            'turno',
            'turno.detalle_turno',
            'turno.detalle_turno.horario',
            'turno.detalle_turno.dia',
            'cargo'
          ]
        });
        //si encuentra al empleado, busca el turno de ese empleado
        if (empleado && empleado.turno) {
          // 1. Obtenemos el día de la semana de la marca (manejamos string de fecha local para evitar desfase de zona horaria)
          const fStr = nuevaMarca.fecha_marca.toString().split('T')[0];
          const [anio, mes, dia] = fStr.includes('-') ? fStr.split('-').map(Number) : fStr.split('/').map(Number);
          const fecha = new Date(anio, mes - 1, dia);
          const diaSemanaJS = fecha.getDay();

          // 2. Mapeo
          const codDiaBusqueda = diaSemanaJS === 0 ? 7 : diaSemanaJS;
          // 3. Buscamos el detalle que corresponde a este día específico
          const detalleHoy = empleado.turno.detalle_turno.find(
            (detalle) => detalle.dia.cod_dia === codDiaBusqueda
          );
          if (detalleHoy && detalleHoy.horario) {
            const horarioOficial = detalleHoy.horario;

            const getMinutes = (time: string) => {
              if (!time || typeof time !== 'string') return 0;
              const [h, m] = time.split(':').map(Number);
              return (h || 0) * 60 + (m || 0);
            };

            const minutesToTime = (min: number) => {
              const h = Math.floor(Math.abs(min) / 60);
              const m = Math.floor(Math.abs(min) % 60);
              return `${min < 0 ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
            };

            const horaEntradaTeorica = horarioOficial.hora_entrada;
            const horaSalidaTeorica = horarioOficial.hora_salida;
            const horaEntradaReal = existeMarcaEntrada.hora_marca;
            const horaSalidaReal = nuevaMarca.hora_marca;

            const durTurnoMin = getMinutes(horaSalidaTeorica) - getMinutes(horaEntradaTeorica);
            const hrsPresMin = getMinutes(horaSalidaReal) - getMinutes(horaEntradaReal);
            const hrsExtrasMin = hrsPresMin - durTurnoMin;

            const creaAutorizaHorasExtras = await this.marcaRepository.manager.save(AutorizaHorasExtra, {
              cargo: empleado.cargo,
              fecha_marca: existeMarcaEntrada.fecha_marca,
              hora_entrada: horaEntradaReal,
              hora_salida: horaSalidaReal,
              hora_entrada_teorica: horaEntradaTeorica,
              hora_salida_teorica: horaSalidaTeorica,
              duracion_turno: minutesToTime(durTurnoMin),
              horas_presenciales: minutesToTime(hrsPresMin),
              horas_extras: minutesToTime(hrsExtrasMin > 0 ? hrsExtrasMin : 0),
              estado: 'P'
            });
          } else {
            console.log('No se encontró un horario configurado para este día.');
          }
        }
      }
    }

    const guardar = await this.marcaRepository.save(nuevaMarca);

    if (!guardar) {
      throw new HttpException('No se pudo crear la marca', 404);
    }

    try {
      const empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, {
        where: { num_ficha: nuevaMarca.num_ficha }, relations: ['cenco']
      });

      if (empleadoInfo && empleadoInfo.email) {
        const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
        const nombreEmpleado = empleadoInfo.nombres;
        const correoCenco = empleadoInfo.cenco.email_notificacion;

        let eventoNombre = 'Marca';
        if (nuevaMarca.evento === 1) eventoNombre = 'Entrada';
        if (nuevaMarca.evento === 2) eventoNombre = 'Salida';

        let fechaFormat = nuevaMarca.fecha_marca;
        if (fechaFormat instanceof Date) {
          fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
        }

        await this.mailerService.sendMail({
          to: correoEmpleado,
          cc: empleadoInfo.email_noti,
          subject: 'Nueva Marca Registrada',
          html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreEmpleado}</h2>
            <p>Se ha creado una nueva marca en el sistema con los siguientes detalles:</p>
            <ul>
              <li><strong>Fecha:</strong> ${fechaFormat}</li>
              <li><strong>Hora:</strong> ${nuevaMarca.hora_marca}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Hashcode:</strong> ${nuevaMarca.hashcode}</li>
            </ul>
            <p>Si no reconoces esta marca o tienes dudas, puedes contactar al administrador.</p>
          </div>`,
        });
      }
    } catch (error) {
      console.error('Error al enviar correo de nueva marca:', error);
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

    const feriados = await this.feriadosRepository.find();

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

      const isFeriado = feriados.some(fer => {
        let fStr = '';
        if (fer.fecha instanceof Date) fStr = fer.fecha.toISOString().substring(0, 10);
        else if (typeof fer.fecha === 'string') fStr = fer.fecha.substring(0, 10);
        return fStr === dateKey;
      });

      const diasNombres = ['', 'Lu.', 'Ma.', 'Mi.', 'Ju.', 'Vi.', 'Sá.', 'Do.'];
      const fechaFormatExt = `${diasNombres[diaSemana]} ${day}-${month}-${year}`;

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
            fecha_marca: fechaFormatExt as any,
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
            fecha_marca: fechaFormatExt as any,
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

        let infoTexto = tieneTurnoHoy ? 'Faltan ambas marcas ' : 'Día libre';
        if (isFeriado) infoTexto = 'Feriado';

        result.push({
          id_marca: null,
          fecha_marca: fechaFormatExt as any,
          hora_marca: null,
          evento: null,
          hashcode: null,
          info_adicional: infoTexto,
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

  async update(id: number, updateMarcaDto: UpdateMarcaDto, usuarioActualizador: string) {
    if (!updateMarcaDto || Object.keys(updateMarcaDto).length === 0) {
      throw new HttpException('No se proporcionaron los datos para actualizar la marca', 400);
    }

    const marca = await this.marcaRepository.findOne({ where: { id_marca: id } });

    if (!marca) {
      throw new HttpException('No se encontró la marca a actualizar', 404);
    }

    Object.assign(marca, updateMarcaDto);
    if (marca.fecha_marca) {
      if (marca.fecha_marca instanceof Date) marca.fecha_marca = marca.fecha_marca.toISOString().substring(0, 10) as any;
      else if (typeof marca.fecha_marca === 'string') marca.fecha_marca = (marca.fecha_marca as string).substring(0, 10) as any;
    }
    marca.hashcode = crypto.createHash('md5').update(JSON.stringify(marca.evento + ';' + marca.fecha_marca + ';' + marca.hora_marca + ';' + marca.num_ficha + ';' + marca.id_tipo_marca + ';' + marca.info_adicional + ';' + marca.comentario)).digest('hex');

    const guardar = await this.marcaRepository.save(marca);

    if (!guardar) {
      throw new HttpException('No se pudo actualizar la marca', 500);
    }

    let fMarca = marca.fecha_marca;
    if (fMarca instanceof Date) {
      fMarca = fMarca.toISOString().substring(0, 10) as any;
    } else if (typeof fMarca === 'string') {
      fMarca = (fMarca as string).substring(0, 10) as any;
    }

    const marcaAuditoria = this.marcasAuditoriaRepository.create({
      id_marca: marca.id_marca,
      marca: { id_marca: marca.id_marca },
      fecha_marca: fMarca,
      hora_marca: marca.hora_marca,
      evento: marca.evento,
      hashcode: marca.hashcode,
      num_ficha: marca.num_ficha,
      fecha_actualizacion: new Date(),
      usuario_actualizador: usuarioActualizador
    });

    Object.assign(marcaAuditoria, updateMarcaDto);
    if (marcaAuditoria.fecha_marca) {
      if (marcaAuditoria.fecha_marca instanceof Date) marcaAuditoria.fecha_marca = marcaAuditoria.fecha_marca.toISOString().substring(0, 10) as any;
      else if (typeof marcaAuditoria.fecha_marca === 'string') marcaAuditoria.fecha_marca = (marcaAuditoria.fecha_marca as string).substring(0, 10) as any;
    }
    if (marcaAuditoria.fecha_actualizacion) {
      if (marcaAuditoria.fecha_actualizacion instanceof Date) marcaAuditoria.fecha_actualizacion = marcaAuditoria.fecha_actualizacion.toISOString().substring(0, 19).replace('T', ' ') as any;
      else if (typeof marcaAuditoria.fecha_actualizacion === 'string') marcaAuditoria.fecha_actualizacion = (marcaAuditoria.fecha_actualizacion as string).substring(0, 19).replace('T', ' ') as any;
    }
    const guardarAuditoria = await this.marcasAuditoriaRepository.save(marcaAuditoria);

    try {
      const empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, {
        where: { num_ficha: marca.num_ficha }, relations: ['cenco']
      });

      if (empleadoInfo && empleadoInfo.email && empleadoInfo.cenco.email_notificacion) {
        const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
        const nombreEmpleado = empleadoInfo.nombres;
        const correoCenco = empleadoInfo.cenco.email_notificacion;

        let eventoNombre = 'Marca';
        if (marca.evento === 1) eventoNombre = 'Entrada';
        if (marca.evento === 2) eventoNombre = 'Salida';

        let fechaFormat = marca.fecha_marca;
        if (fechaFormat instanceof Date) {
          fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
        }

        await this.mailerService.sendMail({
          to: correoEmpleado,
          cc: empleadoInfo.email_noti,
          subject: 'Actualización de Marca Registrada',
          html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreEmpleado}</h2>
            <p>Se ha modificado o actualizado tu registro de marca en el sistema. Los detalles actualizados son los siguientes:</p>
            <ul>
              <li><strong>Fecha:</strong> ${fechaFormat}</li>
              <li><strong>Hora:</strong> ${marca.hora_marca}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Comentario:</strong> ${marca.comentario}</li>
              <li><strong>Hashcode:</strong> ${marca.hashcode}</li>
            </ul>
            <p>Si no reconoces esta modificación o tienes dudas, puedes contactar al administrador.</p>
          </div>`,
        });
      }
    } catch (error) {
      console.error('Error al enviar correo de actualización de marca:', error);
    }

    return { message: 'Marca actualizada exitosamente', data: guardar };
  }

  async remove(id: number) {
    const marca = await this.marcaRepository.findOne({ where: { id_marca: id } });
    if (!marca) {
      throw new HttpException('No se encontró la marca a eliminar', 404);
    }
    const empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, {
      where: { num_ficha: marca.num_ficha }, relations: ['cenco']
    });

    if (empleadoInfo && empleadoInfo.email && empleadoInfo.cenco.email_notificacion) {
      const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
      const nombreEmpleado = empleadoInfo.nombres;
      const correoCenco = empleadoInfo.cenco.email_notificacion;

      let eventoNombre = 'Marca';
      if (marca.evento === 1) eventoNombre = 'Entrada';
      if (marca.evento === 2) eventoNombre = 'Salida';

      let fechaFormat = marca.fecha_marca;
      if (fechaFormat instanceof Date) {
        fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
      }

      await this.mailerService.sendMail({
        to: correoEmpleado,
        cc: empleadoInfo.email_noti,
        subject: 'Eliminacion de Marca Registrada',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreEmpleado}</h2>
            <p>Se ha eliminado tu registro de marca en el sistema. Los detalles son los siguientes:</p>
            <ul>
              <li><strong>Fecha:</strong> ${fechaFormat}</li>
              <li><strong>Hora:</strong> ${marca.hora_marca}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Comentario:</strong> ${marca.comentario}</li>
              <li><strong>Hashcode:</strong> ${marca.hashcode}</li>
            </ul>
            <p>Si tienes dudas, puedes contactar al administrador.</p>
          </div>`,
      });
    }
    await this.marcasAuditoriaRepository.delete({ id_marca: id });
    return this.marcaRepository.delete(id);
  }
}
