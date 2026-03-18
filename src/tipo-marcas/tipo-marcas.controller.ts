import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMarcasService } from './tipo-marcas.service';
import { CreateTipoMarcaDto } from './dto/create-tipo-marca.dto';
import { UpdateTipoMarcaDto } from './dto/update-tipo-marca.dto';

@Controller('tipo-marcas')
export class TipoMarcasController {
  constructor(private readonly tipoMarcasService: TipoMarcasService) {}

  @Post()
  create(@Body() createTipoMarcaDto: CreateTipoMarcaDto) {
    return this.tipoMarcasService.create(createTipoMarcaDto);
  }

  @Get()
  findAll() {
    return this.tipoMarcasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMarcasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoMarcaDto: UpdateTipoMarcaDto) {
    this.tipoMarcasService.update(+id, updateTipoMarcaDto)
    return {
      message: 'TipoMarca actualizado correctamente'
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMarcasService.remove(+id);
  }
}
