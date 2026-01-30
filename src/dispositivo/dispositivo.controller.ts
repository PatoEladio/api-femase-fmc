import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { Dispositivo } from './entities/dispositivo.entity';
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

}
