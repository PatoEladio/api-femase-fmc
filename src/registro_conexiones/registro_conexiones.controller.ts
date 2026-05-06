import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistroConexionesService } from './registro_conexiones.service';
import { CreateRegistroConexioneDto } from './dto/create-registro_conexione.dto';
import { UpdateRegistroConexioneDto } from './dto/update-registro_conexione.dto';

@Controller('registro-conexiones')
export class RegistroConexionesController {
  constructor(private readonly registroConexionesService: RegistroConexionesService) {}

  @Post()
  create(@Body() createRegistroConexioneDto: CreateRegistroConexioneDto) {
    return this.registroConexionesService.create(createRegistroConexioneDto);
  }

  @Get()
  findAll() {
    return this.registroConexionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroConexionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistroConexioneDto: UpdateRegistroConexioneDto) {
    return this.registroConexionesService.update(+id, updateRegistroConexioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroConexionesService.remove(+id);
  }
}
