import { Controller, Get, Post, Body, Patch, Param, } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';

@Controller('dispositivo')
export class DispositivoController {
  constructor(private readonly dispositivoService: DispositivoService) { }

  @Post('crear')
  async create(@Body() createDispositivoDto: CreateDispositivoDto) {
    return await this.dispositivoService.create(createDispositivoDto);
  }

  @Get()
  findAll() {
    return this.dispositivoService.findAll();
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateDispositivoDto: UpdateDispositivoDto) {
    return this.dispositivoService.update(+id, updateDispositivoDto);
  }

  @Get('buscarPorempleado/:rut')
  buscarPorEmpleado(@Param('rut') rut: string) {
    return this.dispositivoService.buscarDispositivosPorEmpleado(rut);
  }

}
