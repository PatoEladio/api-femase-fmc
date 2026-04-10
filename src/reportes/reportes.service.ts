import { Injectable, HttpException } from '@nestjs/common';
const pdfmake = require('pdfmake');
import { MarcasService } from '../marcas/marcas.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';
import { Feriado } from '../feriados/entities/feriado.entity';
import { Between, Repository } from 'typeorm';
import { AttendanceRecordDto, UserReportDto } from './dto/attendance-report.dto';
import { Vacaciones } from 'src/vacaciones/entities/vacaciones.entity';
import { Ausencia } from 'src/ausencias/entities/ausencia.entity';
import { DetalleAsistenciaService } from '../detalle-asistencia/detalle-asistencia.service';

@Injectable()
export class ReportesService {
  constructor(
    private readonly marcasService: MarcasService,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Feriado)
    private readonly feriadosRepository: Repository<Feriado>,
    @InjectRepository(Vacaciones)
    private readonly vacacionesRepository: Repository<Vacaciones>,
    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
    private readonly detalleAsistenciaService: DetalleAsistenciaService,
  ) { }

  async generateAttendancePdf(numFicha: string, fechaInicio: string, fechaFin: string): Promise<Buffer> {
    const dataAsistencia = await this.detalleAsistenciaService.calcularAsistencia(numFicha, fechaInicio, fechaFin);
    const empleado = dataAsistencia.empleado;

    let totalDiasTrabajados = 0;
    let totalDiasAusente = 0;
    let totalDiasDescanso = 0;
    let totalDiasFeriado = 0;

    const registros = dataAsistencia.registros.map((reg: any) => {
      let isFeriadoLibre = false;
      if (reg.observacion === 'Feriado' && reg.entrada === '-' && reg.salida === '-') {
        isFeriadoLibre = true;
      }

      if (reg.entrada !== '-' || reg.salida !== '-') {
        totalDiasTrabajados++;
      } else if (isFeriadoLibre) {
        totalDiasFeriado++;
      } else if (reg.horasTeoricas === '-' || reg.horasTeoricas === '00:00') {
        totalDiasDescanso++;
      } else {
        totalDiasAusente++;
      }

      return reg;
    });

    const data: UserReportDto = {
      nombre: empleado.nombres + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno,
      cargo: empleado.cargo?.nombre || 'Sin cargo',
      rut: empleado.run,
      centroCosto: empleado.cenco?.nombre_cenco || 'Sin cenco',
      fechaIngreso: empleado.fecha_ini_contrato ? new Date(empleado.fecha_ini_contrato).toLocaleDateString('es-CL') : 'N/A',
      periodo: { desde: fechaInicio, hasta: fechaFin }, registros
    };

    const formatMs = (ms: number): string => {
      if (ms <= 0) return '00:00';
      const hrs = Math.floor(ms / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const parseMs = (timeStr: string): number => {
      if (!timeStr || timeStr === '-' || timeStr === '00:00' || typeof timeStr !== 'string') return 0;
      const p = timeStr.split(':');
      if (p.length < 2) return 0;
      const hours = parseInt(p[0]);
      const minutes = parseInt(p[1]);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      return (hours * 3600000) + (minutes * 60000);
    };

    const tableBody: any[] = [
      [
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Jornada ordinaria pactada', style: 'tableHeader' },
        { text: 'Marcaciones jornada', style: 'tableHeader' },
        { text: 'Colación', style: 'tableHeader' },
        { text: 'Marcaciones colación', style: 'tableHeader' },
        { text: 'Tiempo faltante', style: 'tableHeader' },
        { text: 'Tiempo extra', style: 'tableHeader' },
        { text: 'Otras marcaciones', style: 'tableHeader' },
        { text: 'Observaciones', style: 'tableHeader' }
      ]
    ];

    let semTeoricasMs = 0;
    let semPresencialesMs = 0;
    let semAtrasoMs = 0;
    let semJustificadasMs = 0;
    let semExtraMs = 0;
    let semNoTrabajadasMs = 0;
    let semColacionMs = 0;
    let semDiaMs = 0;

    let totalGralAtrasoMs = 0;
    let totalGralJustificadasMs = 0;
    let totalGralExtraMs = 0;
    let totalGralNoTrabajadasMs = 0;
    let totalGralDiaMs = 0;
    let totalGralTeoricaMs = 0;
    let totalGralPresencialMs = 0;
    let totalGralColacionMs = 0;

    for (let i = 0; i < data.registros.length; i++) {
      const reg: any = data.registros[i];

      semTeoricasMs += parseMs(reg.horasTeoricas);
      semPresencialesMs += parseMs(reg.horasPresenciales);
      semAtrasoMs += parseMs(reg.atraso);
      semJustificadasMs += parseMs(reg.horasJustificadas);
      semExtraMs += parseMs(reg.horasExtra);
      semNoTrabajadasMs += parseMs(reg.horasNoTrabajadas);
      semColacionMs += parseMs(reg.colacionTeorica);
      semDiaMs += parseMs(reg.totalDia);

      totalGralTeoricaMs += parseMs(reg.horasTeoricas);
      totalGralPresencialMs += parseMs(reg.horasPresenciales);
      totalGralAtrasoMs += parseMs(reg.atraso);
      totalGralJustificadasMs += parseMs(reg.horasJustificadas);
      totalGralExtraMs += parseMs(reg.horasExtra);
      totalGralNoTrabajadasMs += parseMs(reg.horasNoTrabajadas);
      totalGralColacionMs += parseMs(reg.colacionTeorica);
      totalGralDiaMs += parseMs(reg.totalDia);

      let jornadaPactada = '-';
      let colacionLimpia = reg.colacionTeorica && reg.colacionTeorica !== '-' ? String(reg.colacionTeorica).substring(0, 5) : '00:00';
      if (reg.entradaTeorica && reg.entradaTeorica !== '-' && reg.salidaTeorica && reg.salidaTeorica !== '-') {
        jornadaPactada = `${reg.entradaTeorica} - ${reg.salidaTeorica} (C: ${colacionLimpia})`;
      }

      let marcacionesJornada = '-';
      if (reg.entrada && reg.entrada !== '-') {
        marcacionesJornada = `${reg.entrada} - ${reg.salida && reg.salida !== '-' ? reg.salida : ''}`;
      }

      let marcacionesColacion = 'NO APLICA';
      let otrasMarcaciones = '-';
      if (reg.marcasDia && reg.marcasDia.length > 2) {
        otrasMarcaciones = reg.marcasDia.slice(2).map((m: any) => String(m.hora_marca).substring(0, 5)).join(', ');
      }

      const fechaParts = reg.fecha.split(' ');
      let fechaFormateada = reg.fecha;
      if (fechaParts.length === 2) {
        const dParts = fechaParts[1].split('-');
        if (dParts.length === 3) {
          fechaFormateada = `${dParts[0]}/${dParts[1]}/${dParts[2]}`;
        }
      }

      tableBody.push([
        fechaFormateada,
        jornadaPactada,
        marcacionesJornada,
        colacionLimpia !== '00:00' ? colacionLimpia : '-',
        marcacionesColacion,
        '- ' + reg.horasNoTrabajadas,
        '+ ' + reg.horasExtra,
        otrasMarcaciones,
        reg.observacion
      ]);

      const isSunday = reg.fecha.startsWith('Do.');
      const isLastRecord = i === data.registros.length - 1;

      if (isSunday || isLastRecord) {
        tableBody.push([
          { text: 'Total Semana', style: 'tableHeader', alignment: 'right' },
          { text: formatMs(semTeoricasMs), style: 'tableHeader' },
          { text: formatMs(semPresencialesMs), style: 'tableHeader' },
          { text: formatMs(semColacionMs), style: 'tableHeader' },
          { text: '', style: 'tableHeader' },
          { text: '- ' + formatMs(semNoTrabajadasMs), style: 'tableHeader' },
          { text: '+ ' + formatMs(semExtraMs), style: 'tableHeader' },
          { text: '', style: 'tableHeader' },
          { text: '', style: 'tableHeader' }
        ]);

        semTeoricasMs = 0;
        semPresencialesMs = 0;
        semColacionMs = 0;
        semAtrasoMs = 0;
        semJustificadasMs = 0;
        semExtraMs = 0;
        semNoTrabajadasMs = 0;
        semDiaMs = 0;
      }
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: `REPORTE DE JORNADA DIARIA\n\nPeriodo: ${data.periodo.desde} hasta ${data.periodo.hasta}`, style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Razón Social: ${dataAsistencia.empleado.empresa.nombre_empresa.toUpperCase()}\nRUT Empresa: ${dataAsistencia.empleado.empresa.rut_empresa}\n`, width: '*', fontSize: 11 },
            { text: `Nombre: ${data.nombre.toUpperCase()}\nRUT: ${data.rut}\nLugar de prestación de servicios: ${data.centroCosto.toUpperCase()}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
            body: tableBody
          }
        },
      ],
      styles: {
        header: { fontSize: 13, bold: true },
        subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 8 }
      },
      defaultStyle: { font: 'Helvetica', fontSize: 8 }
    };

    pdfmake.setFonts(fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    return await pdfDoc.getBuffer();
  }

  async generateSimpleAttendancePdf(numFicha: string, fechaInicio: string, fechaFin: string): Promise<Buffer> {
    const dataAsistencia = await this.detalleAsistenciaService.calcularAsistencia(numFicha, fechaInicio, fechaFin);
    const empleado = dataAsistencia.empleado;

    const data = {
      nombre: empleado.nombres + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno,
      cargo: empleado.cargo?.nombre || 'Sin cargo',
      rut: empleado.run,
      centroCosto: empleado.cenco?.nombre_cenco || 'Sin cenco',
      periodo: { desde: fechaInicio, hasta: fechaFin },
      empresa: empleado.empresa?.nombre_empresa || 'FEMASE',
      rutEmpresa: empleado.empresa?.rut_empresa || 'Sin rut'
    };

    const tableBody: any[] = [
      [
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Asistencia', style: 'tableHeader' },
        { text: 'Ausencia', style: 'tableHeader' },
        { text: 'Observaciones', style: 'tableHeader' }
      ]
    ];

    for (let i = 0; i < dataAsistencia.registros.length; i++) {
      const reg = dataAsistencia.registros[i];

      const fechaParts = reg.fecha.split(' ');
      let fechaFormateada = reg.fecha;
      if (fechaParts.length === 2) {
        const dParts = fechaParts[1].split('-');
        if (dParts.length === 3) {
          fechaFormateada = `${dParts[0]}/${dParts[1]}/${dParts[2]}`;
        }
      }

      const esLibreOFeriado = reg.observacion === 'FERIADO' || reg.observacion === 'DIA LIBRE' || reg.horasTeoricas === '-' || reg.horasTeoricas === '00:00';
      const tieneEntradaYSalida = reg.entrada !== '-' && reg.salida !== '-';

      let asistenciaTxt = '';
      if (tieneEntradaYSalida) {
        asistenciaTxt = 'SI';
      } else if (esLibreOFeriado) {
        asistenciaTxt = '-';
      } else {
        asistenciaTxt = 'NO';
      }

      let ausenciaTxt = '';
      if (asistenciaTxt === 'NO') {
        if ((reg.horasJustificadas !== '-' && reg.horasJustificadas !== '00:00') || reg.observacion.includes('AUSENCIA') || reg.observacion.includes('JUSTIFICADA')) {
          ausenciaTxt = 'JUSTIFICADA';
        } else {
          ausenciaTxt = 'NO JUSTIFICADA';
        }
      }

      let observacionEfectiva = reg.observacion;
      if (asistenciaTxt === 'SI') {
        observacionEfectiva = 'PRESENTE CON MARCA';
      }

      tableBody.push([
        fechaFormateada,
        asistenciaTxt,
        ausenciaTxt,
        observacionEfectiva.toUpperCase()
      ]);
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: `REPORTE DE ASISTENCIA\n\nPeriodo: ${data.periodo.desde} hasta ${data.periodo.hasta}`, style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Razón Social: ${data.empresa.toUpperCase()}\nRUT Empresa: ${data.rutEmpresa}\n`, width: '*', fontSize: 11 },
            { text: `Nombre: ${data.nombre.toUpperCase()}\nRUT: ${data.rut}\nLugar de prestación de servicios: ${data.centroCosto.toUpperCase()}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '15%', '25%', '*'],
            body: tableBody
          }
        }
      ],
      styles: {
        header: { fontSize: 13, bold: true },
        subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 10 }
      },
      defaultStyle: { font: 'Helvetica', fontSize: 10 }
    };

    pdfmake.setFonts(fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    return await pdfDoc.getBuffer();
  }

  async generarReporteVacaciones(numFicha: string): Promise<Buffer> {
    const busquedaEmpleado = await this.empleadoRepository.findOne({
      where: {
        num_ficha: numFicha
      },
      relations: ['cenco', 'empresa', 'cargo']
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
      order: {
        fecha_inicio: 'ASC'
      }
    });

    const formatDate = (d: any) => {
      if (!d) return 'N/A';
      if (typeof d === 'string') return d.substring(0, 10).split('-').reverse().join('-');
      if (d instanceof Date) return d.toISOString().substring(0, 10).split('-').reverse().join('-');
      return String(d);
    };

    const tableBody: any[] = [
      [
        { text: 'Fecha Inicio', style: 'tableHeader' },
        { text: 'Fecha Fin', style: 'tableHeader' },
        { text: 'Días\nAcum.', style: 'tableHeader' },
        { text: 'Días\nEfectivos', style: 'tableHeader' },
        { text: 'Saldo Días\nAsignados', style: 'tableHeader' },
        { text: 'Autorizada\nPor', style: 'tableHeader' },
        { text: 'Días Efec.\nVP', style: 'tableHeader' },
        { text: 'Saldo VBA\nPrevio', style: 'tableHeader' },
        { text: 'Saldo VP\nPrevio', style: 'tableHeader' },
        { text: 'Saldo VBA\nPost', style: 'tableHeader' },
        { text: 'Saldo VP\nPost', style: 'tableHeader' }
      ]
    ];
    let totalDiasEfectivos = 0;

    for (let i = 0; i < busquedaVacaciones.length; i++) {
      const vacacion = busquedaVacaciones[i];

      const fInicio = formatDate(vacacion.fecha_inicio);
      const fFin = formatDate(vacacion.fecha_fin);

      const diasAcumuladosNumber = Number(vacacion.dias_acumulados || 0);
      const diasAcumulados = diasAcumuladosNumber.toFixed(2);

      const diasEf = Number(vacacion.dias_efectivos || 0);
      const diasEfectivos = diasEf.toFixed(2);

      totalDiasEfectivos += diasEf;

      const diasEfectivosVP = '0.00';

      const saldoVPPrevio = '0.00';

      const saldoAsignadosNum = diasAcumuladosNumber - totalDiasEfectivos;
      const saldoAsignados = saldoAsignadosNum.toFixed(2);
      const saldoVBAPost = saldoAsignadosNum.toFixed(2);
      const saldoVPPost = '0.00';

      const saldoVBAPrevio = (diasEf + saldoAsignadosNum).toFixed(2);
      const autorizadaPor = vacacion.autorizador || 'S/I';

      tableBody.push([
        fInicio, fFin, diasAcumulados, diasEfectivos, saldoAsignados, autorizadaPor,
        diasEfectivosVP, saldoVBAPrevio, saldoVPPrevio, saldoVBAPost, saldoVPPost
      ]);
    }

    if (busquedaVacaciones.length === 0) {
      tableBody.push([{ text: 'No hay vacaciones registradas', colSpan: 11, alignment: 'center' }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
    }

    const fechaInicioContrato = new Date(busquedaEmpleado.fecha_ini_contrato);
    fechaInicioContrato.setHours(0, 0, 0, 0);
    const fechaGeneracion = new Date();
    fechaGeneracion.setHours(0, 0, 0, 0);

    let mesesTrabajados = (fechaGeneracion.getFullYear() - fechaInicioContrato.getFullYear()) * 12 + (fechaGeneracion.getMonth() - fechaInicioContrato.getMonth());

    if (fechaGeneracion.getDate() < fechaInicioContrato.getDate()) {
      mesesTrabajados--;
    }
    if (mesesTrabajados < 0) mesesTrabajados = 0;

    const diasDelMesActualGen = new Date(fechaGeneracion.getFullYear(), fechaGeneracion.getMonth() + 1, 0).getDate();
    let fechaUltimoCumpleMesGen = new Date(fechaInicioContrato);
    fechaUltimoCumpleMesGen.setMonth(fechaInicioContrato.getMonth() + mesesTrabajados);

    const diffTimeGen = fechaGeneracion.getTime() - fechaUltimoCumpleMesGen.getTime();
    const diasSueltosGen = Math.floor(diffTimeGen / (1000 * 60 * 60 * 24));

    const proporcionalesNormales = (1.25 / diasDelMesActualGen) * diasSueltosGen;
    const totalNormales = (mesesTrabajados * 1.25) + proporcionalesNormales;

    let totalZonaExtrema = 0;
    if (busquedaEmpleado.cenco?.zona_extrema) {
      const proporcionalesZE = (0.42 / diasDelMesActualGen) * diasSueltosGen;
      totalZonaExtrema = (mesesTrabajados * 0.42) + proporcionalesZE;
    }

    const totalAcumulados = totalNormales + totalZonaExtrema;

    let diasUtilizados = 0;
    for (const v of busquedaVacaciones) {
      diasUtilizados += Number(v.dias_efectivos || 0);
    }
    const diasDisponibles = totalAcumulados - diasUtilizados;

    const textoResumen =
      `Total de días:\n` +
      `Normales: ${totalNormales.toFixed(2)}  -  Adicionales: 0.00  -  Progresivos: 0.00  -  Zona Extrema: ${totalZonaExtrema.toFixed(2)}  -  Especiales: 0.00\n\n` +
      `Total de vacaciones acumuladas (al ${fechaGeneracion.toLocaleDateString('es-CL')}): ${totalAcumulados.toFixed(2)}\n` +
      `Total de días utilizados: ${diasUtilizados.toFixed(2)}\n` +
      `Total de días disponibles: ${diasDisponibles.toFixed(2)}`;

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          columns: [
            { text: busquedaEmpleado.empresa?.nombre_empresa || 'Fundación Mi Casa', style: 'header', alignment: 'left', width: '*' },
            { text: 'Fecha generación documento: ' + new Date().toLocaleString('es-CL'), alignment: 'right', fontSize: 10, margin: [0, 2, 0, 0], width: 'auto' }
          ]
        },
        { text: 'Historial de Vacaciones por Persona', style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Nombre: ${busquedaEmpleado.nombres} ${busquedaEmpleado.apellido_paterno} ${busquedaEmpleado.apellido_materno}\nCargo: ${busquedaEmpleado.cargo?.nombre || 'Sin cargo'}`, width: '*', fontSize: 11 },
            { text: `RUT: ${busquedaEmpleado.run}\nFecha Ingreso: ${formatDate(busquedaEmpleado.fecha_ini_contrato)}\nCenco: ${busquedaEmpleado.cenco?.nombre_cenco || 'Sin cenco'}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: '60%',
              text: textoResumen,
              style: 'resumenTexto',
              alignment: 'left'
            },
            {
              width: '40%',
              columns: [
                { text: '__________________\nV° B° Recursos Humanos', alignment: 'center', fontSize: 11 },
                { text: '__________________\nV° B° Trabajador', alignment: 'center', fontSize: 11 }
              ]
            }
          ]
        }
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        subheader: { fontSize: 13, bold: true, margin: [0, 5, 0, 5] as [number, number, number, number] },
        resumenTexto: { fontSize: 11, margin: [0, 5, 0, 5] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 10, alignment: 'center' }
      },
      defaultStyle: { font: 'Helvetica', fontSize: 10, alignment: 'center' }
    };

    pdfmake.setFonts(fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    return await pdfDoc.getBuffer();
  }

  async generarReporteAusencias(numFicha: string, fechaInicioStr?: string, fechaFinStr?: string): Promise<Buffer> {
    const busquedaEmpleado = await this.empleadoRepository.findOne({
      where: {
        num_ficha: numFicha
      },
      relations: ['cenco', 'empresa', 'cargo']
    });

    if (!busquedaEmpleado) {
      throw new HttpException('Empleado no encontrado', 404);
    }

    const where: any = {
      num_ficha: numFicha
    };

    if (fechaInicioStr && fechaFinStr) {
      where.fecha_fin = Between(new Date(fechaInicioStr), new Date(fechaFinStr));
    }

    const busquedaAusencias = await this.ausenciaRepository.find({
      order: {
        id: 'ASC'
      },
      relations: ['tipo_ausencia'],
      where: where
    });

    const formatDate = (d: any) => {
      if (!d) return 'N/A';
      if (typeof d === 'string') return d.substring(0, 10).split('-').reverse().join('-');
      if (d instanceof Date) return d.toISOString().substring(0, 10).split('-').reverse().join('-');
      return String(d);
    };

    const tableBody: any[] = [
      [
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Tipo', style: 'tableHeader' },
        { text: '¿Por horas?', style: 'tableHeader' },
        { text: 'Fecha Inicio', style: 'tableHeader' },
        { text: 'Hora Inicio', style: 'tableHeader' },
        { text: 'Fecha Fin', style: 'tableHeader' },
        { text: 'Hora Fin', style: 'tableHeader' },
        { text: '¿Autorizada?', style: 'tableHeader' },
        { text: 'Autoriza', style: 'tableHeader' }
      ]
    ];

    for (let i = 0; i < busquedaAusencias.length; i++) {
      const ausencia = busquedaAusencias[i];

      tableBody.push([
        formatDate(ausencia.fecha_creacion),
        ausencia.tipo_ausencia?.nombre || 'S/I',
        ausencia.dia_completo ? 'No' : 'Sí',
        formatDate(ausencia.fecha_inicio),
        ausencia.hora_inicio || '-',
        formatDate(ausencia.fecha_fin),
        ausencia.hora_fin || '-',
        ausencia.autorizada ? 'Sí' : 'No',
        ausencia.autorizador || '-'
      ]);
    }

    if (busquedaAusencias.length === 0) {
      tableBody.push([{ text: 'No hay ausencias registradas', colSpan: 9, alignment: 'center' }, {}, {}, {}, {}, {}, {}, {}, {}]);
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          columns: [
            { text: busquedaEmpleado.empresa?.nombre_empresa || 'Fundación Mi Casa', style: 'header', alignment: 'left', width: '*' },
            { text: 'Fecha generación documento: ' + new Date().toLocaleString('es-CL'), alignment: 'right', fontSize: 10, margin: [0, 2, 0, 0], width: 'auto' }
          ]
        },
        { text: 'Reporte de Ausencias por Persona', style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Nombre: ${busquedaEmpleado.nombres} ${busquedaEmpleado.apellido_paterno} ${busquedaEmpleado.apellido_materno}\nCargo: ${busquedaEmpleado.cargo?.nombre || 'Sin cargo'}`, width: '*', fontSize: 11 },
            { text: `RUT: ${busquedaEmpleado.run}\nFecha Ingreso: ${formatDate(busquedaEmpleado.fecha_ini_contrato)}\nCenco: ${busquedaEmpleado.cenco?.nombre_cenco || 'Sin cenco'}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: '60%',
              text: '',
              style: 'resumenTexto',
              alignment: 'left'
            },
            {
              width: '40%',
              columns: [
                { text: '__________________\nV° B° Recursos Humanos', alignment: 'center', fontSize: 11 },
                { text: '__________________\nV° B° Trabajador', alignment: 'center', fontSize: 11 }
              ]
            }
          ]
        }
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        subheader: { fontSize: 13, bold: true, margin: [0, 5, 0, 5] as [number, number, number, number] },
        resumenTexto: { fontSize: 11, margin: [0, 5, 0, 5] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 10, alignment: 'center' }
      },
      defaultStyle: { font: 'Helvetica', fontSize: 10, alignment: 'center' }
    };

    pdfmake.setFonts(fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    return await pdfDoc.getBuffer();
  }

  async generateDomFestPdf(numFicha: string, fechaInicio: string, fechaFin: string): Promise<Buffer> {
    const dataAsistencia = await this.detalleAsistenciaService.calcularAsistencia(numFicha, fechaInicio, fechaFin);
    const empleado = dataAsistencia.empleado;
    const feriados = await this.feriadosRepository.find();

    const data = {
      nombre: empleado.nombres + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno,
      rut: empleado.run,
      centroCosto: empleado.cenco?.nombre_cenco || 'Sin cenco',
      periodo: { desde: fechaInicio, hasta: fechaFin },
      empresa: empleado.empresa?.nombre_empresa || 'FEMASE',
      rutEmpresa: empleado.empresa?.rut_empresa || 'Sin rut'
    };

    const tableBody: any[] = [
      [
        { text: 'Beneficiario descanso adicionales', style: 'tableHeader' },
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Asistencia', style: 'tableHeader' },
        { text: 'Ausencia', style: 'tableHeader' },
        { text: 'Observaciones', style: 'tableHeader' }
      ]
    ];

    // Mapear registros por fecha pura para búsqueda rápida
    const registrosMap = new Map<string, any>();
    dataAsistencia.registros.forEach((reg: any) => {
      // reg.fecha format is usually "Do. 05-04-2026" or similar. 
      // We need to extract the date part "DD-MM-YYYY"
      const parts = reg.fecha.split(' ');
      if (parts.length === 2) {
        registrosMap.set(parts[1], reg);
      }
    });

    const start = new Date(fechaInicio + 'T12:00:00');
    const end = new Date(fechaFin + 'T12:00:00');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 is Sunday
      const fStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const fDisplay = fStr.split('-').reverse().join('-'); // DD-MM-YYYY

      const isFeriado = feriados.some(fer => {
        let ferStr = '';
        if (fer.fecha instanceof Date) ferStr = fer.fecha.toISOString().split('T')[0];
        else ferStr = String(fer.fecha).substring(0, 10);
        return ferStr === fStr;
      });

      if (dayOfWeek === 0 || isFeriado) {
        const reg = registrosMap.get(fDisplay);

        let asistenciaTxt = 'NO';
        let ausenciaTxt = '-';
        let observacionTxt = isFeriado ? 'FERIADO' : 'DOMINGO';

        if (reg) {
          const tieneEntrada = reg.entrada && reg.entrada !== '-';
          const tieneSalida = reg.salida && reg.salida !== '-';
          
          if (tieneEntrada || tieneSalida) {
            asistenciaTxt = 'SI';
            observacionTxt = 'PRESENTE CON MARCA';
          } else {
            asistenciaTxt = 'NO';
            if ((reg.horasJustificadas !== '-' && reg.horasJustificadas !== '00:00') || reg.observacion.includes('AUSENCIA') || reg.observacion.includes('JUSTIFICADA')) {
              ausenciaTxt = 'JUSTIFICADA';
              observacionTxt = 'DIA LIBRE';
            } else if (reg.horasNoTrabajadas !== '-' && reg.horasNoTrabajadas !== '00:00' && reg.horasTeoricas !== '-' && reg.horasTeoricas !== '00:00') {
              ausenciaTxt = 'INJUSTIFICADA';
              if (reg.observacion) observacionTxt = reg.observacion;
            } else {
              observacionTxt = 'DIA LIBRE';
            }
          }
        } else {
          // No hay registro de marca ni de ausencia, por defecto es un día libre (Domingo o Feriado)
          observacionTxt = 'DIA LIBRE';
        }

        tableBody.push([
          numFicha,
          fDisplay,
          asistenciaTxt,
          ausenciaTxt,
          observacionTxt.toUpperCase()
        ]);
      }
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: `REPORTE DOMINGOS Y FESTIVOS\n\nPeriodo: ${data.periodo.desde} hasta ${data.periodo.hasta}`, style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Razón Social: ${data.empresa.toUpperCase()}\nRUT Empresa: ${data.rutEmpresa}\n`, width: '*', fontSize: 11 },
            { text: `Nombre: ${data.nombre.toUpperCase()}\nRUT: ${data.rut}\nLugar de prestación de servicios: ${data.centroCosto.toUpperCase()}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', '*'],
            body: tableBody
          }
        }
      ],
      styles: {
        header: { fontSize: 13, bold: true },
        subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 10 }
      },
      defaultStyle: { font: 'Helvetica', fontSize: 10 }
    };

    pdfmake.setFonts(fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    return await pdfDoc.getBuffer();
  }
}