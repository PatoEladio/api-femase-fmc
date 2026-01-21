import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cargos')
@UseGuards(AuthGuard)
export class CargosController {
  constructor(private readonly cargosService: CargosService) {}

  @Post()
  create(@Body() createCargoDto: CreateCargoDto) {
    return this.cargosService.create(createCargoDto);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub;
    return this.cargosService.findAll(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargosService.update(+id, updateCargoDto);
  }
}
