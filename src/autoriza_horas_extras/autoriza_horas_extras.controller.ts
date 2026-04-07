import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutorizaHorasExtrasService } from './autoriza_horas_extras.service';
import { CreateAutorizaHorasExtraDto } from './dto/create-autoriza_horas_extra.dto';
import { UpdateAutorizaHorasExtraDto } from './dto/update-autoriza_horas_extra.dto';

@Controller('autoriza-horas-extras')
export class AutorizaHorasExtrasController {
  constructor(private readonly autorizaHorasExtrasService: AutorizaHorasExtrasService) {}

  @Post()
  create(@Body() createAutorizaHorasExtraDto: CreateAutorizaHorasExtraDto) {
    return this.autorizaHorasExtrasService.create(createAutorizaHorasExtraDto);
  }

  @Get()
  findAll() {
    return this.autorizaHorasExtrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autorizaHorasExtrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutorizaHorasExtraDto: UpdateAutorizaHorasExtraDto) {
    return this.autorizaHorasExtrasService.update(+id, updateAutorizaHorasExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autorizaHorasExtrasService.remove(+id);
  }
}
