import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { Cenco } from './cenco.entity';
import { UpdateCencoDTO } from './dto/update-cenco.dto';

@Controller('cencos')
export class CencosController {
  constructor(
    private cencoService: CencosService
  ) { }

  @Get('')
  obtenerTodosLosCencos() {
    return this.cencoService.obtenerTodosLosCencos();
  }

  @Post('crear')
  crearCenco(@Body() crearCentroCosto: Cenco) {
    return this.cencoService.crearCenco(crearCentroCosto);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateCencoDTO) {
    return this.cencoService.actualizarCenco(+id, updateDto);
  }
}
