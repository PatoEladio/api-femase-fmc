import { Injectable } from '@nestjs/common';
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
    return this.empresaRepository.find();
  }

  async crearEmpresa(empresa: Empresas) {
    const nuevaEmpresa = this.empresaRepository.create(empresa);
    return await this.empresaRepository.save(nuevaEmpresa);
  }
}
