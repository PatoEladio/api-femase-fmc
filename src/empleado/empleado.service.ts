import { HttpException, Injectable } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

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
        'empresa'
      ]
    });

    if (!empleadoCreado) throw new HttpException('No se encontro el empleado', 400);


    // Encripto run para guardar clave
    const salt = await bcrypt.genSalt();
    const claveHash = await bcrypt.hash(empleadoCreado.run, salt);
    // Creo el usuario
    const nuevoUser = this.userRepository.create({
      username: empleadoCreado?.run,
      password: claveHash,
      nombres: empleadoCreado?.nombres,
      apellido_paterno: empleadoCreado?.apellido_paterno,
      apellido_materno: empleadoCreado?.apellido_materno,
      email: empleadoCreado?.email,
      empresa: empleadoCreado?.empresa,
      estado: { estado_id: 1 },
      perfil: { perfil_id: 8 },
      run_usuario: empleadoCreado?.run,
      empleado: { empleado_id: empleadoCreado?.empleado_id }
    });

    const guardarNuevoUser = await this.userRepository.save(nuevoUser);

    if (!guardarNuevoUser) throw new HttpException('Error al crear el usuario', 400);

    return {
      message: 'Empleado creado correctamente y asociado a un usuario!'
    }
  }
  async findAll() {
    return await this.empleadoRepository.find({
      relations: [
        'estado',
        'empresa',
        'cargo',
        'turno'
      ]
    })
  }

  // Asignar cencos al empleado, deberia seguir la misma logica del usuario

  update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    return `This action updates a #${id} empleado`;
  }

  remove(id: number) {
    return `This action removes a #${id} empleado`;
  }
}
