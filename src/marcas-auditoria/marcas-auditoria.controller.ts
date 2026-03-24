import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MarcasAuditoriaService } from './marcas-auditoria.service';
import { CreateMarcasAuditoriaDto } from './dto/create-marcas-auditoria.dto';
import { UpdateMarcasAuditoriaDto } from './dto/update-marcas-auditoria.dto';

@Controller('marcas-auditoria')
export class MarcasAuditoriaController {
  constructor(private readonly marcasAuditoriaService: MarcasAuditoriaService) { }

  @Post()
  create(@Body() createMarcasAuditoriaDto: CreateMarcasAuditoriaDto) {
    return this.marcasAuditoriaService.create(createMarcasAuditoriaDto);
  }

  @Get()
  findAll(@Query('idMarca') idMarca: number) {
    return this.marcasAuditoriaService.findAll(idMarca);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasAuditoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcasAuditoriaDto: UpdateMarcasAuditoriaDto) {
    return this.marcasAuditoriaService.update(+id, updateMarcasAuditoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasAuditoriaService.remove(+id);
  }
}
