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
import { AutorizaHorasExtra } from 'src/autoriza_horas_extras/entities/autoriza_horas_extra.entity';
import { AsignacionTurnoRotativo } from '../asignacion_turno_rotativo/entities/asignacion_turno_rotativo.entity';

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
    const guardar = await this.marcaRepository.save(nuevaMarca);

    if (!guardar) {
      throw new HttpException('No se pudo crear la marca', 404);
    }

    try {
      const empleadoInfo = await this.marcaRepository.manager.findOne(Empleado, {
        where: { num_ficha: nuevaMarca.num_ficha }, relations: ['cenco', 'empresa']
      });

      if (empleadoInfo && empleadoInfo.email) {
        const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
        const nombreEmpleado = empleadoInfo.nombres + ' ' + empleadoInfo.apellido_paterno + ' ' + empleadoInfo.apellido_materno;
        const correoCenco = empleadoInfo.cenco.email_notificacion;

        let eventoNombre = 'Marca';
        if (nuevaMarca.evento === 1) eventoNombre = 'Entrada';
        if (nuevaMarca.evento === 2) eventoNombre = 'Salida';

        let fechaFormat = nuevaMarca.fecha_marca;
        if (fechaFormat instanceof Date) {
          fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
        }
        const nombre_empresa = empleadoInfo?.empresa.nombre_empresa;
        const rut_empresa = empleadoInfo?.empresa.rut_empresa;
        const direccion = empleadoInfo?.empresa.direccion_empresa;
        const comuna = empleadoInfo?.empresa.comuna_empresa;

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
              <li><strong>Nombre:</strong> ${nombreEmpleado}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Hashcode:</strong> ${nuevaMarca.hashcode}</li>
            </ul>
            <p>Sistema exepcional de jordana: No Aplica</p>
            <p>Resolución Exenta: No Aplica</p>
            <p>Geolocalización: No Aplica</p>
            <p>Empleador:</p>
            <ul>
              <li><strong>Nombre Empresa:</strong> ${nombre_empresa}</li>
              <li><strong>Rut Empresa:</strong> ${rut_empresa}</li>
              <li><strong>Dirección Empresa:</strong> ${direccion}</li>
              <li><strong>Comuna Empresa:</strong> ${comuna}</li>
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
                colacion: true,
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

    let asignacionesRotativas: AsignacionTurnoRotativo[] = [];
    if (empleadoInfo.permite_rotativo) {
      asignacionesRotativas = await this.marcaRepository.manager.find(AsignacionTurnoRotativo, {
        where: {
          empleado: { num_ficha: numFicha }
        },
        relations: ['horario']
      });
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

      let horarioTurnoRotativo: any = null;
      if (empleadoInfo?.permite_rotativo) {
        const asignacion = asignacionesRotativas.find(a => {
          let start = '';
          if (a.fecha_inicio_turno instanceof Date) start = a.fecha_inicio_turno.toISOString().substring(0, 10);
          else start = String(a.fecha_inicio_turno).substring(0, 10);

          let end = '';
          if (a.fecha_fin_turno instanceof Date) end = a.fecha_fin_turno.toISOString().substring(0, 10);
          else end = String(a.fecha_fin_turno).substring(0, 10);

          return dateKey >= start && dateKey <= end;
        });
        if (asignacion) {
          horarioTurnoRotativo = asignacion.horario;
        }
      }

      let tieneTurnoHoy = diasConTurno.includes(diaSemana);
      if (empleadoInfo?.permite_rotativo) {
        tieneTurnoHoy = !!horarioTurnoRotativo;
      }

      const marcasDelDia = busqueda.filter((m) => {
        let mDateKey = '';
        if (typeof m.fecha_marca === 'string') {
          mDateKey = (m.fecha_marca as string).substring(0, 10);
        } else if (m.fecha_marca instanceof Date) {
          // Usar UTC ya que TypeORM suele devolver columnas 'date' en 00:00:00 UTC
          const year = m.fecha_marca.getUTCFullYear();
          const month = String(m.fecha_marca.getUTCMonth() + 1).padStart(2, '0');
          const day = String(m.fecha_marca.getUTCDate()).padStart(2, '0');
          mDateKey = `${year}-${month}-${day}`;
        } else if (m.fecha_marca) {
            const d = new Date(m.fecha_marca);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            mDateKey = `${year}-${month}-${day}`;
        }
        return mDateKey === dateKey;
      });

      if (marcasDelDia.length > 0) {
        const formateadas = marcasDelDia.map(m => {
          let dtDia = m.empleado?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);
          let overrideHorario = dtDia && (dtDia as any).horario ? (dtDia as any).horario : null;
          if (empleadoInfo?.permite_rotativo && horarioTurnoRotativo) {
            overrideHorario = horarioTurnoRotativo;
          }

          return {
            ...m,
            fecha_marca: fechaFormatExt as any,
            empleado: m.empleado ? {
              ...m.empleado,
              turno: m.empleado.turno ? {
                ...m.empleado.turno,
                detalle_turno: overrideHorario ? { horario: overrideHorario } : null
              } : (overrideHorario ? { detalle_turno: { horario: overrideHorario } } : null)
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

          let dtDia = empleadoInfo?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);
          let overrideHorario = dtDia && (dtDia as any).horario ? (dtDia as any).horario : null;
          if (empleadoInfo?.permite_rotativo && horarioTurnoRotativo) {
            overrideHorario = horarioTurnoRotativo;
          }

          result.push({
            id_marca: null,
            fecha_marca: fechaFormatExt as any,
            hora_marca: null,
            evento: null,
            hashcode: null,
            info_adicional: infoFaltante,
            dispositivo: null,
            tieneTurno: tieneTurnoHoy,
            empleado: {
              num_ficha: empleadoInfo?.num_ficha,
              turno: empleadoInfo?.turno ? {
                turno_id: empleadoInfo.turno.turno_id,
                detalle_turno: overrideHorario ? { horario: overrideHorario } : null
              } : (overrideHorario ? { detalle_turno: { horario: overrideHorario } } : null)
            },
          } as any);
        }
      } else {
        let dtDia = empleadoInfo?.turno?.detalle_turno?.find((dt: any) => dt.dia?.cod_dia === diaSemana);

        let infoTexto = tieneTurnoHoy ? 'Faltan ambas marcas ' : 'Día libre';
        if (isFeriado) infoTexto = 'Feriado';

        let overrideHorario = dtDia && (dtDia as any).horario ? (dtDia as any).horario : null;
        if (empleadoInfo?.permite_rotativo && horarioTurnoRotativo) {
          overrideHorario = horarioTurnoRotativo;
        }

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
              detalle_turno: overrideHorario ? { horario: overrideHorario } : null
            } : (overrideHorario ? { detalle_turno: { horario: overrideHorario } } : null)
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
        where: { num_ficha: marca.num_ficha }, relations: ['cenco', 'empresa']
      });

      if (empleadoInfo && empleadoInfo.email && empleadoInfo.cenco.email_notificacion) {
        const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
        const nombreEmpleadoCompleto = empleadoInfo.nombres + ' ' + empleadoInfo.apellido_paterno + ' ' + empleadoInfo.apellido_materno;
        const correoCenco = empleadoInfo.cenco.email_notificacion;

        let eventoNombre = 'Marca';
        if (marca.evento === 1) eventoNombre = 'Entrada';
        if (marca.evento === 2) eventoNombre = 'Salida';

        let fechaFormat = marca.fecha_marca;
        if (fechaFormat instanceof Date) {
          fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
        }

        const nombre_empresa = empleadoInfo?.empresa.nombre_empresa;
        const rut_empresa = empleadoInfo?.empresa.rut_empresa;
        const direccion = empleadoInfo?.empresa.direccion_empresa;
        const comuna = empleadoInfo?.empresa.comuna_empresa;

        await this.mailerService.sendMail({
          to: correoEmpleado,
          cc: empleadoInfo.email_noti,
          subject: 'Marca Modificada',
          html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreEmpleadoCompleto}</h2>
            <p>Se ha modificado una marca en el sistema con los siguientes detalles:</p>
            <ul>
              <li><strong>Fecha:</strong> ${fechaFormat}</li>
              <li><strong>Hora:</strong> ${marca.hora_marca}</li>
              <li><strong>Nombre:</strong> ${nombreEmpleadoCompleto}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Hashcode:</strong> ${marca.hashcode}</li>
              <li><strong>Comentario:</strong> ${marca.comentario}</li>
            </ul>
            <p>Sistema exepcional de jordana: No Aplica</p>
            <p>Resolución Exenta: No Aplica</p>
            <p>Geolocalización: No Aplica</p>
            <p>Empleador:</p>
            <ul>
              <li><strong>Nombre Empresa:</strong> ${nombre_empresa}</li>
              <li><strong>Rut Empresa:</strong> ${rut_empresa}</li>
              <li><strong>Dirección Empresa:</strong> ${direccion}</li>
              <li><strong>Comuna Empresa:</strong> ${comuna}</li>
            </ul>

            <p>Si no reconoces esta marca o tienes dudas, puedes contactar al administrador.</p>
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
      where: { num_ficha: marca.num_ficha }, relations: ['cenco', 'empresa']
    });

    if (empleadoInfo && empleadoInfo.email && empleadoInfo.cenco.email_notificacion) {
      const correoEmpleado = empleadoInfo.email;  // CAMBIAR A CORREO LABORAL SIESQUE ES NECESARIO
      const nombreEmpleado = empleadoInfo.nombres + ' ' + empleadoInfo.apellido_paterno + ' ' + empleadoInfo.apellido_materno;
      const correoCenco = empleadoInfo.cenco.email_notificacion;

      let eventoNombre = 'Marca';
      if (marca.evento === 1) eventoNombre = 'Entrada';
      if (marca.evento === 2) eventoNombre = 'Salida';

      let fechaFormat = marca.fecha_marca;
      if (fechaFormat instanceof Date) {
        fechaFormat = fechaFormat.toISOString().substring(0, 10) as any;
      }

      const nombre_empresa = empleadoInfo?.empresa.nombre_empresa;
      const rut_empresa = empleadoInfo?.empresa.rut_empresa;
      const direccion = empleadoInfo?.empresa.direccion_empresa;
      const comuna = empleadoInfo?.empresa.comuna_empresa;

      await this.mailerService.sendMail({
        to: correoEmpleado,
        cc: empleadoInfo.email_noti,
        subject: 'Eliminacion de Marca Registrada',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreEmpleado}</h2>
            <p>Se ha eliminado una marca en el sistema con los siguientes detalles:</p>
            <ul>
              <li><strong>Fecha:</strong> ${fechaFormat}</li>
              <li><strong>Hora:</strong> ${marca.hora_marca}</li>
              <li><strong>Nombre:</strong> ${nombreEmpleado}</li>
              <li><strong>Evento:</strong> ${eventoNombre}</li>
              <li><strong>Hashcode:</strong> ${marca.hashcode}</li>
              <li><strong>Comentario:</strong> ${marca.comentario}</li>
            </ul>
            <p>Sistema exepcional de jordana: No Aplica</p>
            <p>Resolución Exenta: No Aplica</p>
            <p>Geolocalización: No Aplica</p>
            <p>Empleador:</p>
            <ul>
              <li><strong>Nombre Empresa:</strong> ${nombre_empresa}</li>
              <li><strong>Rut Empresa:</strong> ${rut_empresa}</li>
              <li><strong>Dirección Empresa:</strong> ${direccion}</li>
              <li><strong>Comuna Empresa:</strong> ${comuna}</li>
            </ul>

            <p>Si no reconoces esta marca o tienes dudas, puedes contactar al administrador.</p>
          </div>`,
      });
    }
    await this.marcasAuditoriaRepository.delete({ id_marca: id });
    return this.marcaRepository.delete(id);
  }

  async getMarcasByHash(hashcode: string) {
    const marca = await this.marcaRepository.findOne({
      where: { hashcode: hashcode },
      relations: [
        'empleado',
        'empleado.turno',
        'empleado.turno.detalle_turno',
        'empleado.turno.detalle_turno.horario',
        'empleado.turno.detalle_turno.dia',
        'tipo_marca',
        'dispositivo'
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
          nombres: true,
          apellido_paterno: true,
          turno: {
            turno_id: true,
            nombre: true,
            detalle_turno: {
              id_detalle_turno: true,
              dia: {
                cod_dia: true,
              },
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

    if (!marca) return null;

    // Formatear fecha y filtrar turno (siguiendo la lógica de findAll)
    const fecha = new Date(marca.fecha_marca);
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();

    let diaSemana = fecha.getDay();
    if (diaSemana === 0) diaSemana = 7;

    const diasNombres = ['', 'Lu.', 'Ma.', 'Mi.', 'Ju.', 'Vi.', 'Sá.', 'Do.'];
    const fechaFormatExt = `${diasNombres[diaSemana]} ${day}-${month}-${year}`;

    let horarioFinal: any = null;
    if (marca.empleado?.turno?.detalle_turno) {
      const dtDia = marca.empleado.turno.detalle_turno.find((dt: any) => dt.dia?.cod_dia === diaSemana);
      if (dtDia && dtDia.horario) {
        horarioFinal = dtDia.horario;
      }
    }

    return {
      ...marca,
      fecha_marca: fechaFormatExt as any,
      empleado: marca.empleado ? {
        ...marca.empleado,
        turno: marca.empleado.turno ? {
          ...marca.empleado.turno,
          detalle_turno: horarioFinal ? { horario: horarioFinal } : null
        } : (horarioFinal ? { detalle_turno: { horario: horarioFinal } } : null)
      } : null
    };
  }
}
