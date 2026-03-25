import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('marcas')
@UseGuards(AuthGuard)
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) { }

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Get()
  findAll(@Query("numFicha") numFicha: string, @Query("fechaInicio") fechaInicio: string, @Query("fechaFin") fechaFin: string) {
    return this.marcasService.findAll(numFicha, fechaInicio, fechaFin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto, @Req() req: any) {
    return this.marcasService.update(+id, updateMarcaDto, req.user.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }
}
