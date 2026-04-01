import { Injectable, HttpException } from '@nestjs/common';
const pdfmake = require('pdfmake');
import { MarcasService } from '../marcas/marcas.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from '../empleado/entities/empleado.entity';
import { Feriado } from '../feriados/entities/feriado.entity';
import { Repository } from 'typeorm';
import { AttendanceRecordDto, UserReportDto } from './dto/attendance-report.dto';
import { Vacaciones } from 'src/vacaciones/entities/vacaciones.entity';

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
  ) { }

  async generateAttendancePdf(numFicha: string, fechaInicio: string, fechaFin: string): Promise<Buffer> {
    const empleado = await this.empleadoRepository.findOne({
      where: { num_ficha: numFicha },
      relations: ['cargo', 'cenco', 'empresa', 'turno']
    });

    if (!empleado) throw new HttpException('Empleado no encontrado', 404);

    const marcasResult = await this.marcasService.findAll(numFicha, fechaInicio, fechaFin);
    const feriados = await this.feriadosRepository.find();

    const registrosMap = new Map<string, AttendanceRecordDto>();

    for (const m of marcasResult) {
      const f = String(m.fecha_marca); // 'Lu. 21-03-2026'
      if (!registrosMap.has(f)) {
        registrosMap.set(f, {
          fecha: f,
          entrada: null as any,
          salida: null as any,
          entradaTeorica: m.empleado?.turno?.detalle_turno?.horario?.hora_entrada || '-',
          salidaTeorica: m.empleado?.turno?.detalle_turno?.horario?.hora_salida || '-',
          horasTeoricas: '00:00',
          horasPresenciales: '-',
          atraso: '-',
          horasJustificadas: '-',
          horasExtra: '-',
          horasNoTrabajadas: '-',
          totalDia: '-',
          observacion: m.info_adicional || '',
        });
      }

      const entry = registrosMap.get(f)!;
      // In marcas, evento = 1 is Entrada, evento = 2 is Salida
      if (m.evento === 1 && m.hora_marca) entry.entrada = String(m.hora_marca);
      if (m.evento === 2 && m.hora_marca) entry.salida = String(m.hora_marca);

      if (m.info_adicional && entry.observacion !== m.info_adicional) {
        if (!entry.observacion || entry.observacion.includes('Falta Marca') || entry.observacion.includes('Faltan ambas')) {
          entry.observacion = m.info_adicional;
        }
      }
    }

    const formatMs = (ms: number): string => {
      if (ms <= 0) return '00:00';
      const hrs = Math.floor(ms / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const diffMsStr = (t1: string, t2: string): number => {
      if (t1 === '-' || t2 === '-') return 0;
      const d1 = new Date(`1970-01-01T${t1}`);
      let d2 = new Date(`1970-01-01T${t2}`);
      if (d2 < d1) d2 = new Date(`1970-01-02T${t2}`);
      return d2.getTime() - d1.getTime();
    };

    let totalDiasTrabajados = 0;
    let totalDiasAusente = 0;
    let totalDiasDescanso = 0;
    let totalDiasFeriado = 0;

    const registros = Array.from(registrosMap.values()).map(reg => {
      const entTeo = reg.entradaTeorica !== '-' ? reg.entradaTeorica.substring(0, 5) : '-';
      const salTeo = reg.salidaTeorica !== '-' ? reg.salidaTeorica.substring(0, 5) : '-';

      let hrsTeoricasMs = 0;
      if (entTeo !== '-' && salTeo !== '-') {
        hrsTeoricasMs = diffMsStr(entTeo, salTeo);
        reg.horasTeoricas = formatMs(hrsTeoricasMs);
      } else {
        reg.horasTeoricas = '-';
      }

      const entReal = reg.entrada ? reg.entrada.substring(0, 5) : '-';
      const salReal = reg.salida ? reg.salida.substring(0, 5) : '-';

      let hrsPresencialesMs = 0;
      if (entReal !== '-' && salReal !== '-') {
        hrsPresencialesMs = diffMsStr(entReal, salReal);
        reg.horasPresenciales = formatMs(hrsPresencialesMs);
      }

      let totalDiaMs = 0;
      if (hrsPresencialesMs > 30 * 60000) {
        totalDiaMs = hrsPresencialesMs - (30 * 60000);
        reg.totalDia = formatMs(totalDiaMs);
      } else if (hrsPresencialesMs > 0) {
        totalDiaMs = hrsPresencialesMs;
        reg.totalDia = formatMs(totalDiaMs);
      }

      let atrasoMs = 0;
      if (entReal !== '-' && entTeo !== '-') {
        const diff = new Date(`1970-01-01T${entReal}`).getTime() - new Date(`1970-01-01T${entTeo}`).getTime();
        if (diff > 0) {
          atrasoMs = diff;
          reg.atraso = formatMs(atrasoMs);
        } else {
          reg.atraso = '00:00';
        }
      }

      let noTrabajadasMs = 0;
      if (hrsTeoricasMs > 0 && totalDiaMs === 0) {
        noTrabajadasMs = hrsTeoricasMs;
        reg.horasNoTrabajadas = formatMs(noTrabajadasMs);
      } else if (hrsTeoricasMs > 0 && totalDiaMs > 0) {
        if (hrsTeoricasMs > totalDiaMs) {
          noTrabajadasMs = hrsTeoricasMs - totalDiaMs;
          reg.horasNoTrabajadas = formatMs(noTrabajadasMs);
        } else {
          reg.horasNoTrabajadas = '00:00';
        }
      }

      const parts = reg.fecha.split(' ')[1].split('-');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const isFeriado = feriados.some(fer => {
        let fStr = '';
        if (fer.fecha instanceof Date) fStr = fer.fecha.toISOString().substring(0, 10);
        else if (typeof fer.fecha === 'string') fStr = fer.fecha.substring(0, 10);
        return fStr === formattedDate;
      });

      let isFeriadoLibre = false;
      if (isFeriado) {
        if (entReal === '-' && salReal === '-') {
          reg.observacion = 'Feriado';
          isFeriadoLibre = true;
        }
      }

      // Calculation of days stats
      if (entReal !== '-' || salReal !== '-') {
        totalDiasTrabajados++;
      } else if (isFeriadoLibre) {
        totalDiasFeriado++;
      } else if (hrsTeoricasMs === 0) {
        totalDiasDescanso++;
      } else {
        totalDiasAusente++;
      }
      return { ...reg, entrada: entReal, salida: salReal, entradaTeorica: entTeo, salidaTeorica: salTeo, };
    });

    const data: UserReportDto = {
      nombre: empleado.nombres + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno,
      cargo: empleado.cargo?.nombre || 'Sin cargo',
      rut: empleado.run,
      centroCosto: empleado.cenco?.nombre_cenco || 'Sin cenco',
      fechaIngreso: empleado.fecha_ini_contrato ? new Date(empleado.fecha_ini_contrato).toLocaleDateString('es-CL') : 'N/A',
      periodo: { desde: fechaInicio, hasta: fechaFin }, registros
    };

    const parseMs = (timeStr: string): number => {
      if (!timeStr || timeStr === '-' || timeStr === '00:00') return 0;
      const p = timeStr.split(':');
      if (p.length !== 2) return 0;
      return (parseInt(p[0]) * 3600000) + (parseInt(p[1]) * 60000);
    };

    const tableBody: any[] = [
      [
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Entrada', style: 'tableHeader' },
        { text: 'Salida', style: 'tableHeader' },
        { text: 'Ent. Téor.', style: 'tableHeader' },
        { text: 'Sal. Téor.', style: 'tableHeader' },
        { text: 'Hrs. Téor.', style: 'tableHeader' },
        { text: 'Hrs. Pres.', style: 'tableHeader' },
        { text: 'Atraso', style: 'tableHeader' },
        { text: 'Hrs. Justif.', style: 'tableHeader' },
        { text: 'Hrs. Extras', style: 'tableHeader' },
        { text: 'No Trab.', style: 'tableHeader' },
        { text: 'Total Día', style: 'tableHeader' },
        { text: 'Observación', style: 'tableHeader' }
      ]
    ];

    let semTeoricasMs = 0;
    let semPresencialesMs = 0;
    let semAtrasoMs = 0;
    let semDiaMs = 0;

    for (let i = 0; i < data.registros.length; i++) {
      const reg = data.registros[i];

      semTeoricasMs += parseMs(reg.horasTeoricas);
      semPresencialesMs += parseMs(reg.horasPresenciales);
      semAtrasoMs += parseMs(reg.atraso);
      semDiaMs += parseMs(reg.totalDia);

      tableBody.push([
        reg.fecha, reg.entrada, reg.salida, reg.entradaTeorica, reg.salidaTeorica, reg.horasTeoricas,
        reg.horasPresenciales, reg.atraso, reg.horasJustificadas, reg.horasExtra, reg.horasNoTrabajadas, reg.totalDia, reg.observacion
      ]);

      const isSunday = reg.fecha.startsWith('Do.');
      const isLastRecord = i === data.registros.length - 1;

      if (isSunday || isLastRecord) {
        tableBody.push([
          { text: 'Total Semana', style: 'tableHeader', colSpan: 5, alignment: 'right' },
          {}, {}, {}, {},
          { text: formatMs(semTeoricasMs), style: 'tableHeader' },
          { text: formatMs(semPresencialesMs), style: 'tableHeader' },
          { text: formatMs(semAtrasoMs), style: 'tableHeader' },
          { text: '', style: 'tableHeader' },
          { text: '00:00', style: 'tableHeader' },
          { text: '', style: 'tableHeader' },
          { text: formatMs(semDiaMs), style: 'tableHeader' },
          { text: '', style: 'tableHeader' }
        ]);

        semTeoricasMs = 0;
        semPresencialesMs = 0;
        semAtrasoMs = 0;
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
        {
          columns: [
            { text: empleado.empresa?.nombre_empresa || 'Fundación Mi Casa', style: 'header', alignment: 'left', width: '*' },
            { text: 'Fecha generación documento: ' + new Date().toLocaleString('es-CL'), alignment: 'right', fontSize: 10, margin: [0, 2, 0, 0], width: 'auto' }
          ]
        },
        { text: 'Asistencia semanal por Persona', style: 'subheader', alignment: 'center', margin: [0, 10, 0, 0] },
        {
          columns: [
            { text: `Nombre: ${data.nombre}\nCargo: ${data.cargo}`, width: '*', fontSize: 11 },
            { text: `RUT: ${data.rut}\nPeriodo: ${data.periodo.desde} - ${data.periodo.hasta}\nCenco: ${data.centroCosto}`, width: '*', fontSize: 11 }
          ],
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
            body: tableBody
          }
        },
        {
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: '40%',
              text: `Total Días Trabajados: ${totalDiasTrabajados}\nTotal Días Ausente: ${totalDiasAusente}\nTotal Días Descanso: ${totalDiasDescanso}\nTotal Días Feriado: ${totalDiasFeriado}`,
              style: 'subheader',
              alignment: 'left'
            },
            {
              width: '60%',
              columns: [
                { text: '__________________\nV° B° Jefe Directo', alignment: 'center', fontSize: 11 },
                { text: '__________________\nV° B° Trabajador', alignment: 'center', fontSize: 11 }
              ]
            }
          ]
        }
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
}