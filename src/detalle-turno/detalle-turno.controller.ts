import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleTurnoService } from './detalle-turno.service';
import { CreateDetalleTurnoDto } from './dto/create-detalle-turno.dto';
import { UpdateDetalleTurnoDto } from './dto/update-detalle-turno.dto';

@Controller('detalle-turno')
export class DetalleTurnoController {
  constructor(private readonly detalleTurnoService: DetalleTurnoService) {}

  @Post()
  create(@Body() createDetalleTurnoDto: CreateDetalleTurnoDto) {
    return this.detalleTurnoService.create(createDetalleTurnoDto);
  }

  @Get()
  findAll() {
    return this.detalleTurnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleTurnoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleTurnoDto: UpdateDetalleTurnoDto) {
    return this.detalleTurnoService.update(+id, updateDetalleTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleTurnoService.remove(+id);
  }
}
