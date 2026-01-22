import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { Cenco } from './cenco.entity';
import { UpdateCencoDTO } from './dto/update-cenco.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cencos')
@UseGuards(AuthGuard)
export class CencosController {
  constructor(
    private cencoService: CencosService
  ) { }

  @Get('')
  obtenerTodosLosCencos() {
    return this.cencoService.obtenerTodosLosCencos();
  }

  @Post('crear')
  crearCenco(@Body() crearCentroCosto: Cenco, @Req() req) {
    const usuario = req.user.username;
    return this.cencoService.crearCenco(crearCentroCosto, usuario);
  }

  @Patch('actualizar/:id')
  actualizar(@Param('id') id: string, @Body() updateDto: UpdateCencoDTO) {
    return this.cencoService.actualizarCenco(+id, updateDto);
  }
}
