import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SemanaService } from './semana.service';
import { CreateSemanaDto } from './dto/create-semana.dto';
import { UpdateSemanaDto } from './dto/update-semana.dto';

@Controller('semana')
export class SemanaController {
  constructor(private readonly semanaService: SemanaService) {}

  @Post()
  create(@Body() createSemanaDto: CreateSemanaDto) {
    return this.semanaService.create(createSemanaDto);
  }

  @Get()
  findAll() {
    return this.semanaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semanaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSemanaDto: UpdateSemanaDto) {
    return this.semanaService.update(+id, updateSemanaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semanaService.remove(+id);
  }
}
