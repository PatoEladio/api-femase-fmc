import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './departamento.entity';
import { Repository } from 'typeorm';
import { DepartamentoCreatedDto } from './dto/departamento-created.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>
  ) { }

  async buscarTodosLosDepartamentos(userId: number): Promise<Departamento[]> {
    const busqueda = this.departamentoRepository.find({
      relations: ['estado', 'empresa'],
      where: {
        empresa: {
          usuario: {
            usuario_id: userId
          }
        }
      },
      order: { departamento_id: 'ASC' },
      select: {
        departamento_id: true,
        nombre_departamento: true,
        estado: true,
        empresa: {
          empresa_id: true,
          nombre_empresa: true
        }
      }
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se han encontrado departamentos para esta empresa', 400);
    }
  }

  async crearDepartamento(departamento: Departamento): Promise<DepartamentoCreatedDto> {
    try {
      const nuevoDepartamento = this.departamentoRepository.create(departamento);
      const guardada = this.departamentoRepository.save(nuevoDepartamento);

      return {
        departamento_id: (await guardada).departamento_id,
        nombre_departamento: (await guardada).nombre_departamento,
        mensaje: 'Empresa creada correctamente'
      }

    } catch (error) {
      // Error de PostgreSQL/MySQL para "llave duplicada" (comúnmente código 23505)
      if (error.code === '23505') {
        throw new ConflictException('El departamento ya existe o el identificador está duplicado');
      }

      // Error de validación de datos
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      // Error genérico por si falla la conexión o algo inesperado
      throw new InternalServerErrorException('Error crítico al crear el departamento en la base de datos');
    }
  }

  async actualizarDepto(id: number, updateDto: UpdateDepartamentoDto): Promise<any> {
    // 1. Preload busca por ID y "mezcla" los datos nuevos con los existentes
    const departamento = await this.departamentoRepository.preload({
      departamento_id: id,
      ...updateDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!departamento) {
      throw new NotFoundException(`El departamento con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.departamentoRepository.save(departamento);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Departamento actualizado con éxito',
        id: actualizada.departamento_id,
        nombre: actualizada.nombre_departamento
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro departamento');
      }
      throw new InternalServerErrorException('Error al actualizar el departamento');
    }
  }
}
