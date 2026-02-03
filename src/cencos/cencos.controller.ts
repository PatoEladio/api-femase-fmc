import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { Cenco } from './cenco.entity';
import { UpdateCencoDTO } from './dto/update-cenco.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCencoDto } from './dto/create-cenco.dto';

@ApiTags('Centros de Costo (Cenco)')
@Controller('cencos')
@UseGuards(AuthGuard)
export class CencosController {
  constructor(
    private cencoService: CencosService
  ) { }

  @Get('')
  obtenerTodosLosCencos() {
    return this.cencoService.findAll();
  }

  @Post('')
  @ApiOperation({ summary: 'Crear un nuevo Cenco (opcionalmente con dispositivos)' })
  @ApiResponse({ status: 201, description: 'El centro ha sido creado con éxito.' })
  async create(@Body() createCencoDto: CreateCencoDto) {
    return await this.cencoService.create(createCencoDto);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateCencoDTO) {
    return this.cencoService.actualizarCenco(+id, updateDto);
  }

  @Patch(':id/turnos')
  async updateTurnos(
    @Param('id', ParseIntPipe) id: number,
    @Body('turno_ids') turnoIds: number[]
  ) {
    return await this.cencoService.asignarTurnos(id, turnoIds);
  }

  @Post('asignar-turnos/:id')
  async addTurnos(
    @Param('id') id: number,
    @Body('turnoIds') turnoIds: number[]
  ) {
    return this.cencoService.asignarTurnos(id, turnoIds);
  }

  @Delete('eliminar-turnos/:id')
  @ApiOperation({ summary: 'Remover turnos de un centro' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { turnoIds: { type: 'array', items: { type: 'number' } } }
    }
  })
  async removeTurnos(
    @Param('id', ParseIntPipe) id: number,
    @Body('turnoIds') turnoIds: number[],
  ) {
    return await this.cencoService.removeTurnosConValidacion(id, turnoIds);
  }
}
