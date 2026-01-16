import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresas } from './empresas.entity';
import { Repository } from 'typeorm';
import { EmpresaCreadaDto } from './dto/empresa-creada.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

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
      ],
      order: {
        empresa_id: 'ASC'
      }
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron empresas', 400)
    }
  }

  async obtenerEmpresasPorUsuario(usuarioId: number): Promise<Empresas[]> {
    const busqueda = this.empresaRepository.find({
      relations: [
        'estado'
      ],
      order: {
        empresa_id: 'ASC'
      },
      where: {
        usuario: {
          usuario_id: usuarioId
        }
      }
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron empresas', 400)
    }
  }

  async crearEmpresa(empresa: Empresas): Promise<EmpresaCreadaDto> {
    try {
      const nuevaEmpresa = this.empresaRepository.create(empresa);
      const guardada = this.empresaRepository.save(nuevaEmpresa);

      return {
        empresa_id: (await guardada).empresa_id,
        nombre_empresa: (await guardada).nombre_empresa,
        mensaje: 'Empresa creada correctamente'
      }

    } catch (error) {
      // Error de PostgreSQL/MySQL para "llave duplicada" (comúnmente código 23505)
      if (error.code === '23505') {
        throw new ConflictException('La empresa ya existe o el identificador está duplicado');
      }

      // Error de validación de datos
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      // Error genérico por si falla la conexión o algo inesperado
      throw new InternalServerErrorException('Error crítico al crear la empresa en la base de datos');
    }
  }

  async actualizarEmpresa(id: number, updateDto: UpdateEmpresaDto): Promise<any> {
    // 1. Preload busca por ID y "mezcla" los datos nuevos con los existentes
    const empresa = await this.empresaRepository.preload({
      empresa_id: id,
      ...updateDto,
    });

    // 2. Si no existe el ID, lanzamos 404
    if (!empresa) {
      throw new NotFoundException(`La empresa con ID ${id} no existe`);
    }

    try {
      // 3. Guardamos los cambios (esto disparará validaciones de BD)
      const actualizada = await this.empresaRepository.save(empresa);

      // 4. Retornamos respuesta personalizada
      return {
        mensaje: 'Empresa actualizada con éxito',
        id: actualizada.empresa_id,
        nombre: actualizada.nombre_empresa,
        rut: actualizada.rut_empresa
      };
    } catch (error) {
      // Manejo de error por si el RUT duplicado choca
      if (error.code === '23505') {
        throw new ConflictException('El RUT ya pertenece a otra empresa');
      }
      throw new InternalServerErrorException('Error al actualizar la empresa');
    }
  }
}