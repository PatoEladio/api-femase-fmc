import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from './perfil.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>
  ) { }

  async obtenerTodosLosPerfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find({ relations: ['estado'] });
  }

  async crearPerfil(perfil: Perfil) {
    const nuevoPerfil = this.perfilRepository.create(perfil);
    return await this.perfilRepository.save(nuevoPerfil);
  }

  async actualizarPerfil(perfilId: number, infoActualizar: Perfil): Promise<Perfil | null> {
    await this.perfilRepository.update(perfilId, infoActualizar);
    return this.perfilRepository.findOne({ where: { perfil_id: perfilId } });
  }
}
