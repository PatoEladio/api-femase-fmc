import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Cenco } from 'src/cencos/cenco.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createEmpleadoDto: Empleado) {
    // Primero creo el empleado
    const nuevoEmpleado = this.empleadoRepository.create(createEmpleadoDto);
    const guardarNuevoEmpleado = await this.empleadoRepository.save(nuevoEmpleado);

    if (!guardarNuevoEmpleado) throw new HttpException('Error al crear el empleado', 400);

    // Busco al empleado creado
    const empleadoCreado = await this.empleadoRepository.findOne({
      where: { empleado_id: guardarNuevoEmpleado.empleado_id },
      relations: [
        'estado',
        'empresa',
        'cenco'
      ]
    });

    if (!empleadoCreado) throw new HttpException('No se encontro el empleado', 400);

    // Encripto run para guardar clave
    const salt = await bcrypt.genSalt();
    const claveHash = await bcrypt.hash(empleadoCreado.run, salt);

    // Creo el usuario ligado exclusivamente a esta ficha
    const nuevoUser = this.userRepository.create({
      username: empleadoCreado?.num_ficha, // Usando num_ficha como login
      password: claveHash,
      nombres: empleadoCreado?.nombres,
      apellido_paterno: empleadoCreado?.apellido_paterno,
      apellido_materno: empleadoCreado?.apellido_materno,
      email: empleadoCreado?.email,
      empresa: empleadoCreado?.empresa,
      estado: { estado_id: 1 },
      perfil: { perfil_id: 8 },
      run_usuario: empleadoCreado?.run,
      empleado: { empleado_id: empleadoCreado?.empleado_id },
      cencos: empleadoCreado.cenco ? [empleadoCreado.cenco] : [] // Asignamos su cenco inicial
    });

    const guardarNuevoUser = await this.userRepository.save(nuevoUser);
    if (!guardarNuevoUser) throw new HttpException('Error al crear el usuario', 400);

    return {
      message: 'Empleado creado correctamente y asociado a un usuario!'
    }
  }


  async findAll() {
    const empleados = await this.empleadoRepository.find({
      order: {
        empleado_id: 'ASC'
      },
      relations: [
        'estado',
        'empresa',
        'cargo',
        'turno',
        "cenco"
      ]
    });

    const usuarios = await this.userRepository.find({
      relations: ['empleado', 'cencos']
    });

    return empleados.map(emp => {
      const u = usuarios.find(usuario => usuario.empleado?.empleado_id === emp.empleado_id);
      return {
        ...emp,
        cencos: u ? u.cencos : []
      };
    });
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto | any): Promise<any> {
    const dtoTransformado = { ...updateEmpleadoDto };
    const empleado = await this.empleadoRepository.preload({
      empleado_id: id,
      ...dtoTransformado,
    });

    if (!empleado) {
      throw new NotFoundException(`El empleado con ID ${id} no existe`);
    }

    try {
      // 1. Guardar cambios en empleado
      const actualizada = await this.empleadoRepository.save(empleado);

      // 2. Traer empleado actualizado con su nuevo cenco
      const empGuardado = await this.empleadoRepository.findOne({
        where: { empleado_id: actualizada.empleado_id },
        relations: ['cenco']
      });

      if (empGuardado) {
        // Buscar especifícamente el usuario que pertenece a este empleado (ficha)
        const usuario = await this.userRepository.findOne({
          where: { empleado: { empleado_id: empGuardado.empleado_id } },
          relations: ['cencos', 'empleado']
        });

        if (usuario) {
          // Si el empleado tiene un cenco, lo asignamos; si se lo quitaron, vaciamos la lista.
          usuario.cencos = empGuardado.cenco ? [empGuardado.cenco] : [];
          await this.userRepository.save(usuario);
        }
      }

      return {
        mensaje: 'Empleado actualizado con exito y cenco de usuario sincronizado',
        id: actualizada.empleado_id
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe el empleado');
      }
      throw new InternalServerErrorException('Error al actualizar el empleado');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} empleado`;
  }

}


