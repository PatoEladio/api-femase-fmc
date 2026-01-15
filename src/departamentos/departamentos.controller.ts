import { Controller, Get } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';

@Controller('departamentos')
export class DepartamentosController {
  constructor(
    private departamentoService: DepartamentosService
  ) { }
  
  @Get('')
  buscarDepartamentos() {
    return this.departamentoService.buscarTodosLosDepartamentos();
  }
}
