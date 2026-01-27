import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresas } from './empresas.entity';
import { Repository } from 'typeorm';
import { EmpresaCreadaDto } from './dto/empresa-creada.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { BuscarEmpresaDto } from './dto/search-empresa.dto';
import { log } from 'util';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresas)
    private empresaRepository: Repository<Empresas>
  ) { }

  async obtenerTodasLasEmpresas(usuarioId: number, perfilId: number): Promise<BuscarEmpresaDto> {
    const allEmpresas = await this.empresaRepository.find({
      relations: ['estado'],
      order: { empresa_id: 'asc' }
    });

    if (allEmpresas.length > 0) {
      if (perfilId == 1 || perfilId == 3) {
        return {
          empresas: allEmpresas,
          mensaje: 'Usuario superadmin o fiscalizador, se envian todas las empresas'
        }
      } else {
        const filteredEmpresas = await this.empresaRepository.query(`
          select e.empresa_id, e.nombre_empresa, e.rut_empresa, e.direccion_empresa, e.estado_id, e.comuna_empresa, e.email_empresa, e.usuario_creador, e.fecha_creacion, e.fecha_actualizacion
          from db_fmc.empresa as e
          join db_fmc.usuario as u 
          on u.empresa_id = e.empresa_id
          where u.usuario_id = $1`
          , [usuarioId]);
        return {
          empresas: filteredEmpresas,
          mensaje: 'Se envia la empresa del usuario'
        }
      }
    } else {
      return {
        empresas: [],
        mensaje: 'No hay empresas'
      }
    }
  }

  async crearEmpresa(empresa: Empresas, usuario: string, idUsuario: number): Promise<EmpresaCreadaDto> {
    try {
      const nuevaEmpresa = this.empresaRepository.create(empresa);
      nuevaEmpresa.usuario_creador = usuario;
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