import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AusenciasService } from './ausencias.service';
import { CreateAusenciaDto } from './dto/create-ausencia.dto';
import { UpdateAusenciaDto } from './dto/update-ausencia.dto';

@Controller('ausencias')
export class AusenciasController {
  constructor(private readonly ausenciasService: AusenciasService) {}

  @Post()
  create(@Body() createAusenciaDto: CreateAusenciaDto) {
    return this.ausenciasService.create(createAusenciaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAusenciaDto: UpdateAusenciaDto) {
    return this.ausenciasService.update(+id, updateAusenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ausenciasService.remove(+id);
  }
}
