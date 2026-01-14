import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresas } from './empresas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresas)
    private empresaRepository: Repository<Empresas>
  ) { }

  async obtenerTodasLasEmpresas(): Promise<Empresas[]> {
    const busqueda = this.empresaRepository.find({
      relations: [
        'estado'
      ]
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron empresas', 400)
    }
  }

  async buscarEmpresasPorEstado(estadoId: number): Promise<Empresas[]> {
    const busqueda = this.empresaRepository.find({
      where: {
        estado: {
          estado_id: estadoId
        }
      },
      relations: [
        'estado'
      ]
    })

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron empresas', 400)
    }
  }

  async crearEmpresa(empresa: Empresas) {
    const nuevaEmpresa = this.empresaRepository.create(empresa);
    return await this.empresaRepository.save(nuevaEmpresa);
  }
}
