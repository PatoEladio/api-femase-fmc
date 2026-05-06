import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Turno } from './entities/turno.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('turno')
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTurnoDto: Turno, @Req() req) {
    const usuario = req.user.username;
    return this.turnoService.create(createTurnoDto, usuario);
  }

  @Get(':empresa_id')
  findAll(@Param("empresa_id") empresa_id: string) {
    if (isNaN(+empresa_id)) return [];
    return this.turnoService.findAll(+empresa_id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(+id, updateTurnoDto);
  }

  @Patch('asignar-empleados/:id')
  asignarEmpleados(@Param('id') id: string, @Body("empleadosIds") empleadosIds: number[]) {
    return this.turnoService.asignarEmpleados(+id, empleadosIds);
  }

  @Patch('asignar-turnos/:idturno/:idcenco')
  asignarCencos(@Param('idturno') idturno: string, @Param('idcenco') idcenco: string) {
    return this.turnoService.asignarCenco(+idturno, +idcenco);
  }

  @Patch('asignar-horario/:id')
  @UseGuards(AuthGuard)
  asignarHorario(
    @Param('id') id_turno: string,
    @Body('id_dia') id_dia: number[],
    @Body('id_horario') id_horario: number[],
    @Req() req
  ) {
    const usuario = req.user.username;
    return this.turnoService.asignarHorario(+id_turno, id_dia, id_horario, usuario);
  }

  @Get("obtener-horario/:id")
  obtenerHorario(@Param("id") id_turno: string) {
    return this.turnoService.obtenerHorarioPorTurno(+id_turno);
  }

}
