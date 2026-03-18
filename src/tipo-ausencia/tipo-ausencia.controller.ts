import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoAusenciaService } from './tipo-ausencia.service';
import { CreateTipoAusenciaDto } from './dto/create-tipo-ausencia.dto';
import { UpdateTipoAusenciaDto } from './dto/update-tipo-ausencia.dto';

@Controller('tipo-ausencia')
export class TipoAusenciaController {
  constructor(private readonly tipoAusenciaService: TipoAusenciaService) {}

  @Post("crear")
  create(@Body() createTipoAusenciaDto: CreateTipoAusenciaDto) {
    return this.tipoAusenciaService.create(createTipoAusenciaDto);
  }

  @Get()
  findAll() {
    return this.tipoAusenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoAusenciaService.findOne(+id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateTipoAusenciaDto: UpdateTipoAusenciaDto) {
    return this.tipoAusenciaService.update(+id, updateTipoAusenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoAusenciaService.remove(+id);
  }
}
