import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ErrorRechazoService } from './error-rechazo.service';
import { CreateErrorRechazoDto } from './dto/create-error-rechazo.dto';
import { UpdateErrorRechazoDto } from './dto/update-error-rechazo.dto';


@Controller('error-rechazo')
export class ErrorRechazoController {
  constructor(private readonly errorRechazoService: ErrorRechazoService) {}

  @Post("crear")
  create(@Body() createErrorRechazoDto: CreateErrorRechazoDto) {
    const errrorRechazoCreado = this.errorRechazoService.create(createErrorRechazoDto);
    return {mensaje:"Error Rechazo creado exitosamente", data: errrorRechazoCreado};
  }

  @Get()
  obtenerErrorRechazos(){
    return this.errorRechazoService.obtenerErrorrechazos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.errorRechazoService.findOne(+id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateErrorRechazoDto: UpdateErrorRechazoDto) {
    const errorRechazoActualizado = this.errorRechazoService.update(+id, updateErrorRechazoDto);
    return {mensaje: "Error Rechazo actualizado exitosamente", data: errorRechazoActualizado};
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errorRechazoService.remove(+id);
  }
}
