import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Documento } from './entities/documento.entity';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Firma } from 'src/firmas/entities/firma.entity';

@Injectable()
export class DocumentoService {

  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>
  ) { }

 create(createDocumentoDto: CreateDocumentoDto) {
    return this.documentoRepository.save(createDocumentoDto);
  }

  async findAll(empresa_id: number) {
    return await this.documentoRepository.find({
      where: {
        empresa: { empresa_id: empresa_id }
      },
      relations: ['empresa']
    });
  }

  async findOne(id: number) {
    const documento = await this.documentoRepository.findOne({ where: { id } });
    if (!documento) {
      throw new NotFoundException(`El documento con ID ${id} no existe`);
    }
    return documento;
  }

  async update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    const documento = await this.documentoRepository.preload({ id, ...updateDocumentoDto });
    if (!documento) {
      throw new NotFoundException(`El documento con ID ${id} no existe`);
    }
    return await this.documentoRepository.save(documento);
  }

  async remove(id: number) {
    const documento = await this.documentoRepository.findOne({ where: { id } });
    if (!documento) {
      throw new NotFoundException(`El documento con ID ${id} no existe`);
    }
    await this.documentoRepository.remove(documento);
    return {
      mensaje: 'Documento eliminado con exito',
      id: id
    };
  }
}
