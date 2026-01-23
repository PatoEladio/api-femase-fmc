import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Cargo } from './entities/cargo.entity';

@Controller('cargos')
@UseGuards(AuthGuard)
export class CargosController {
  constructor(private readonly cargosService: CargosService) { }

  @Post('crear')
  create(@Body() createCargoDto: Cargo, @Req() req) {
    const usuario = req.user.username;
    return this.cargosService.create(createCargoDto, usuario);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub;
    return this.cargosService.findAll(userId);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargosService.update(+id, updateCargoDto);
  }
}
