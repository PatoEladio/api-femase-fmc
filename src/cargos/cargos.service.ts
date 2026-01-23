import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cargo } from './entities/cargo.entity';
import { Repository } from 'typeorm';
import { SearchCargoDto } from './dto/search-cargo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
@UseGuards(AuthGuard)
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>
  ) { }

  async create(createCargoDto: Cargo, usuario: string): Promise<CreateCargoDto> {
    try {
      const nuevo = this.cargoRepository.create(createCargoDto);
      nuevo.usuario_creador = usuario;
      const guardada = this.cargoRepository.save(nuevo);

      return {
        cargo_id: (await guardada).cargo_id,
        nombre: (await guardada).nombre,
        mensaje: 'Cargo creado correctamente'
      }

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El cargo ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear el cargo en la base de datos');
    }
  }

  async findAll(userId: number): Promise<SearchCargoDto> {
    const busqueda = await this.cargoRepository.find({
      where: {
        empresa: {
          usuario: {
            usuario_id: userId
          }
        }
      }, order: {
        cargo_id: 'asc'
      }, relations: ['estado', 'empresa']
    });

    if (busqueda.length > 0) {
      return {
        cargos: busqueda,
        mensaje: 'Cargos encontrados!'
      }
    } else {
      return {
        cargos: [],
        mensaje: 'No se han encontrado cargos'
      }
    }

  }

  async update(id: number, updateCargoDto: UpdateCargoDto): Promise<any> {
    const cargo = await this.cargoRepository.preload({
      cargo_id: id,
      ...updateCargoDto,
    });
    
    // 2. Si no existe el ID, lanzamos 404
    if (!cargo) {
      throw new NotFoundException(`El cargo con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.cargoRepository.save(cargo);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Cargo actualizado con éxito',
        id: actualizada.cargo_id,
        nombre: actualizada.nombre
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro cargo');
      }
      throw new InternalServerErrorException('Error al actualizar el cargo');
    }
  }
}