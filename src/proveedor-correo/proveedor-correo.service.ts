import { Injectable } from '@nestjs/common';
import { CreateProveedorCorreoDto } from './dto/create-proveedor-correo.dto';
import { UpdateProveedorCorreoDto } from './dto/update-proveedor-correo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProveedorCorreo } from './entities/proveedor-correo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProveedorCorreoService {
  constructor(
    @InjectRepository(ProveedorCorreo)
    private readonly proveedorCorreoRepository: Repository<ProveedorCorreo>,
  ) { }


  async create(createProveedorCorreoDto: CreateProveedorCorreoDto) {
    const nuevoProveedorCorreo = this.proveedorCorreoRepository.create(createProveedorCorreoDto);
    return await this.proveedorCorreoRepository.save(nuevoProveedorCorreo);
  }

  async findAll() {
    const busqueda = await this.proveedorCorreoRepository.find({
      order: {
        id: "ASC"
      }
    });
    if (busqueda.length === 0) {
      return { proveedorCorreo: [] };
    }
    return { proveedorCorreo: busqueda };
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorCorreo`;
  }

  async update(id: number, updateProveedorCorreoDto: UpdateProveedorCorreoDto) {
   const proveedorCorreoActualizado = await this.proveedorCorreoRepository.update(id, updateProveedorCorreoDto);
   return proveedorCorreoActualizado;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorCorreo`;
  }
}
