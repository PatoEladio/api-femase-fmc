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

  @Get()
  findAll() {
    return this.turnoService.findAll();
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(+id, updateTurnoDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnoService.remove(+id);
  }

  @Patch('asignar-empleados/:id')
  asignarEmpleados(@Param('id') id: string, @Body("empleadosIds") empleadosIds: number[]) {
    return this.turnoService.asignarEmpleados(+id, empleadosIds);
  }

  @Patch('asignar-turnos/:idturno/:idcenco')
  asignarCencos(@Param('idturno') idturno: string, @Param('idcenco') idcenco: string) {
    return this.turnoService.asignarCenco(+idturno, +idcenco);
  }
}
