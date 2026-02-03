import { BadRequestException, ConflictException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cenco } from './cenco.entity';
import { In, Repository } from 'typeorm';
import { CencoCreadoDTO } from './dto/created-cenco.dto';
import { UpdateCencoDTO } from './dto/update-cenco.dto';
import { SearchCencoDto } from './dto/search-cenco.dto';
import { CreateCencoDto } from './dto/create-cenco.dto';
import { Turno } from 'src/turno/entities/turno.entity';

@Injectable()
export class CencosService {
  constructor(
    @InjectRepository(Cenco)
    private cencoRepository: Repository<Cenco>,
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>
  ) { }

  async findAll() {
    return await this.cencoRepository.find({
      relations: ['dispositivos', 'departamento', 'estado', 'turnos'],
      order: { cenco_id: 'asc' }
    })
  }

  async create(createCencoDto: CreateCencoDto) {
    const nuevoCenco = this.cencoRepository.create(createCencoDto);
    return await this.cencoRepository.save(nuevoCenco);
  }

  async actualizarCenco(id: number, updateDto: UpdateCencoDTO): Promise<any> {
    const cenco = await this.cencoRepository.preload({
      cenco_id: id,
      ...updateDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!cenco) {
      throw new NotFoundException(`El centro de costo con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.cencoRepository.save(cenco);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Centro de costo actualizado con éxito',
        id: actualizada.cenco_id,
        nombre: actualizada.nombre_cenco
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el centro de costo');
      }
      throw new InternalServerErrorException('Error al actualizar el centro de costo');
    }
  }

  async asignarTurnos(cencoId: number, turnoIds: number[]) {
    // 1. Buscamos el cenco cargando sus turnos actuales
    const cenco = await this.cencoRepository.findOne({
      where: { cenco_id: cencoId },
      relations: ['turnos']
    });

    if (!cenco) throw new NotFoundException('Centro no encontrado');

    // 2. Reasignamos el array con objetos que solo tengan el ID
    // Esto le dice a TypeORM: "Estos son los únicos turnos que deben existir ahora"
    cenco.turnos = turnoIds.map(id => ({ turno_id: id } as Turno));

    // 3. Guardamos la entidad completa
    return await this.cencoRepository.save(cenco);
  }
}
