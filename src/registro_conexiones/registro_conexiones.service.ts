import { Injectable } from '@nestjs/common';
import { CreateRegistroConexioneDto } from './dto/create-registro_conexione.dto';
import { UpdateRegistroConexioneDto } from './dto/update-registro_conexione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroConexione } from './entities/registro_conexione.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegistroConexionesService {
  constructor(
    @InjectRepository(RegistroConexione)
    private readonly registroConexioneRepository: Repository<RegistroConexione>,
  ) { }

  async create(createRegistroConexioneDto: CreateRegistroConexioneDto) {
    const nuevaConexion = this.registroConexioneRepository.create(createRegistroConexioneDto);
    return await this.registroConexioneRepository.save(nuevaConexion);
  }

  findAll() {
    return this.registroConexioneRepository.find();
  }

  findOne(id: number) {
    return this.registroConexioneRepository.findOneBy({ id });
  }

  update(id: number, updateRegistroConexioneDto: UpdateRegistroConexioneDto) {
    return `This action updates a #${id} registroConexione`;
  }

  remove(id: number) {
    return `This action removes a #${id} registroConexione`;
  }
}
