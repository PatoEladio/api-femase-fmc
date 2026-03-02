import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorCorreoService } from './proveedor-correo.service';
import { CreateProveedorCorreoDto } from './dto/create-proveedor-correo.dto';
import { UpdateProveedorCorreoDto } from './dto/update-proveedor-correo.dto';

@Controller('proveedor-correo')
export class ProveedorCorreoController {
  constructor(private readonly proveedorCorreoService: ProveedorCorreoService) {}

  @Post("crear")
  create(@Body() createProveedorCorreoDto: CreateProveedorCorreoDto) {
    return this.proveedorCorreoService.create(createProveedorCorreoDto);
  }

  @Get()
  findAll() {
    return this.proveedorCorreoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorCorreoService.findOne(+id);
  }

  @Patch('actualizar/:id')
  update(@Param('id') id: string, @Body() updateProveedorCorreoDto: UpdateProveedorCorreoDto) {
    const proveedorCorreoActualizado = this.proveedorCorreoService.update(+id, updateProveedorCorreoDto);
    return { mensaje: "proveedor correo actualizado con exito ", data: proveedorCorreoActualizado };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorCorreoService.remove(+id);
  }
}
