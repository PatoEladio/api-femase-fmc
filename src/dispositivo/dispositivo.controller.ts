import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { Dispositivo } from './entities/dispositivo.entity';

@Controller('dispositivo')
export class DispositivoController {
  constructor(private readonly dispositivoService: DispositivoService) { }

  @Post('crear')
  create(@Body() createDispositivo: Dispositivo) {
    return this.dispositivoService.create(createDispositivo);
  }

  @Get()
  findAll() {
    return this.dispositivoService.findAll();
  }


  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateDispositivoDto: UpdateDispositivoDto) {
    return this.dispositivoService.update(+id, updateDispositivoDto);
  }

}
