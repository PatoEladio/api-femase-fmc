import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AfpService } from './afp.service';
import { CreateAfpDto } from './dto/create-afp.dto';
import { UpdateAfpDto } from './dto/update-afp.dto';

@Controller('afp')
export class AfpController {
  constructor(private readonly afpService: AfpService) { }

  @Post("crear")
  async create(@Body() createAfpDto: CreateAfpDto) {
    const afpCreada = await this.afpService.create(createAfpDto);
    return { mensaje: "afp creada con exito ", data: afpCreada };
  }

  @Get()
  findAll() {
    return this.afpService.buscarTodasLasAfp();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.afpService.findOne(+id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateAfpDto: UpdateAfpDto) {
    const afpActualizada = this.afpService.update(+id, updateAfpDto);
    return { mensaje: "afp actualizada con exito ", data: afpActualizada };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.afpService.remove(+id);
  }
}
