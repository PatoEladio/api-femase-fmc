import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { Cenco } from './cenco.entity';
import { UpdateCencoDTO } from './dto/update-cenco.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
