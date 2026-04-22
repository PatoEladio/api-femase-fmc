import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DetalleTurnoService } from './detalle-turno.service';
import { CreateDetalleTurnoDto } from './dto/create-detalle-turno.dto';
import { UpdateDetalleTurnoDto } from './dto/update-detalle-turno.dto';

@Controller('detalle-turno')
@UseGuards(AuthGuard)
export class DetalleTurnoController {
  constructor(private readonly detalleTurnoService: DetalleTurnoService) {}

  @Post()
  create(@Body() createDetalleTurnoDto: CreateDetalleTurnoDto, @Req() req: any) {
    return this.detalleTurnoService.create(createDetalleTurnoDto, req.user.username);
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
  update(@Param('id') id: string, @Body() updateDetalleTurnoDto: UpdateDetalleTurnoDto, @Req() req: any) {
    return this.detalleTurnoService.update(+id, updateDetalleTurnoDto, req.user.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleTurnoService.remove(+id);
  }
}
