import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TipoDispositivoService } from './tipo-dispositivo.service';
import { UpdateTipoDispositivoDto } from './dto/update-tipo-dispositivo.dto';
import { TipoDispositivo } from './entities/tipo-dispositivo.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tipo-dispositivo')
@UseGuards(AuthGuard)
export class TipoDispositivoController {
  constructor(private readonly tipoDispositivoService: TipoDispositivoService) {}

  @Post('crear')
  create(@Body() createTipoDispositivoDto: TipoDispositivo, @Req() req) {
    const usuario = req.user.username;
    return this.tipoDispositivoService.create(createTipoDispositivoDto, usuario);
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
