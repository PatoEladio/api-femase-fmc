import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoDispositivoService } from './tipo-dispositivo.service';
import { UpdateTipoDispositivoDto } from './dto/update-tipo-dispositivo.dto';
import { TipoDispositivo } from './entities/tipo-dispositivo.entity';

@Controller('tipo-dispositivo')
export class TipoDispositivoController {
  constructor(private readonly tipoDispositivoService: TipoDispositivoService) {}

  @Post('crear')
  create(@Body() createTipoDispositivoDto: TipoDispositivo) {
    return this.tipoDispositivoService.create(createTipoDispositivoDto);
  }

  @Get()
  findAll() {
    return this.tipoDispositivoService.findAll();
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateTipoDispositivoDto: UpdateTipoDispositivoDto) {
    return this.tipoDispositivoService.update(+id, updateTipoDispositivoDto);
  }
}
