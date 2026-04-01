import { Controller, Get, Query, Res, HttpException } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import type { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) { }

  @Get('asistencia/pdf')
  async generateAttendanceReport(
    @Query('numFicha') numFicha: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() res: Response
  ) {
    if (!numFicha || !fechaInicio || !fechaFin) {
      throw new HttpException('Faltan parámetros requeridos', 400);
    }

    try {
      const pdfBuffer = await this.reportesService.generateAttendancePdf(numFicha, fechaInicio, fechaFin);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="asistencia_${numFicha}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException('Error generando reporte: ' + error.message, 500);
    }
  }

  @Get('vacaciones/pdf')
  async generateVacacionesReport(
    @Query('numFicha') numFicha: string,
    @Res() res: Response
  ) {
    if (!numFicha) {
      throw new HttpException('Faltan parámetros requeridos', 400);
    }

    try {
      const pdfBuffer = await this.reportesService.generarReporteVacaciones(numFicha);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="vacaciones_${numFicha}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException('Error generando reporte: ' + error.message, 500);
    }
  }
}
