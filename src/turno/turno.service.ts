import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository, In } from 'typeorm';
import { TurnoHorario } from 'src/turno-horario/entities/turno-horario.entity';
import { Semana } from 'src/turno-horario/entities/semana.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cenco } from 'src/cencos/cenco.entity';


@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(Cenco)
    private cencoRepository: Repository<Cenco>
  ) { }

  async create(createTurnoDto: Turno, usuario: string) {
    try {
      const nuevo = this.turnoRepository.create(createTurnoDto);
      //nuevo.usuario_creador = usuario;
      const guardada = await this.turnoRepository.save(nuevo);
      return {
        turno_id: guardada.turno_id,
        nombre: guardada.nombre,
        empresa: guardada.empresa
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El registro ya existe o el identificador está duplicado');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Los datos proporcionados no son válidos');
      }

      throw new InternalServerErrorException('Error crítico al crear el registro en la base de datos');
    }
  }


  findAll() {
    return this.turnoRepository.find({
      relations: ['empresa', 'horario', 'estado', 'dias', 'dias.semana'],
      order: {
        turno_id: 'asc'
      }
    });
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto) {
    const result = await this.turnoRepository.preload({
      turno_id: id,
      ...updateTurnoDto,
    });

    if (!result) {
      throw new NotFoundException(`EL registro con ID ${id} no existe`);
    }

    try {
      const actualizada = await this.turnoRepository.save(result);

      return {
        mensaje: 'Registro actualizado con éxito',
        id: actualizada.turno_id
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre ya pertenece a otro registro');
      }
      throw new InternalServerErrorException('Error al actualizar el registro');
    }
  }

  async asignarDias(id: number, dias: Number[]) {
    const turno = await this.turnoRepository.findOne({
      where: { turno_id: id },
      relations: ['dias']
    })

    if (!turno) {
      throw new NotFoundException(`EL registro con ID ${id} no existe`);
    }

    turno.dias = dias.map(numero_dia => {
      return {
        semana: {
          cod_dia: numero_dia
        }
      } as TurnoHorario
    });
    return await this.turnoRepository.save(turno);
  }

  remove(id: number) {
    return `This action removes a #${id} turno`;
  }

  async asignarEmpleados(turnoId: number, empleadosIds: number[]) {
    const turno = await this.turnoRepository.findOne({ where: { turno_id: turnoId } });
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    // 1. Buscamos a todos los empleados que actualmente tienen este turno
    const empleadosActuales = await this.empleadoRepository.find({
      where: { turno: { turno_id: turnoId } },
      relations: ['turno']
    });

    // 2. Les quitamos el turno a todos (los dejamos en null o desasignados)
    if (empleadosActuales.length > 0) {
      empleadosActuales.forEach(emp => emp.turno = null);
      await this.empleadoRepository.save(empleadosActuales);
    }

    // 3. Si mandaron un array vacío, terminamos aquí
    if (!empleadosIds || empleadosIds.length === 0) {
      return {
        mensaje: 'Turno desasignado de todos los empleados con éxito',
        turno_id: turno.turno_id,
        empleados_actualizados: empleadosActuales.length
      };
    }

    // 4. Si mandaron IDs, buscamos esos empleados y les asignamos el turno
    const nuevosEmpleados = await this.empleadoRepository.find({
      where: { empleado_id: In(empleadosIds) }
    });

    if (nuevosEmpleados.length === 0) {
      throw new NotFoundException('No se encontraron empleados con los IDs proporcionados');
    }

    nuevosEmpleados.forEach(emp => emp.turno = turno);
    await this.empleadoRepository.save(nuevosEmpleados);

    return {
      mensaje: 'Empleados asignados al turno con éxito',
      turno_id: turno.turno_id,
      empleados_actualizados: nuevosEmpleados.length
    };
  }


  async asignarCenco(turnoId: number, cencoId: number) {
    const turno = await this.turnoRepository.findOne({
      where: {
        turno_id: turnoId
      }
    })
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }
    const cenco = await this.cencoRepository.findOne({
      where: {
        cenco_id: cencoId
      },
      relations: ['turnos']
    })
    if (!cenco) {
      throw new NotFoundException("cenco no encontrado")
    }

    const existeTurno = cenco.turnos.find(turno => turno.turno_id === turnoId)
    if (!existeTurno) {
      cenco.turnos.push(turno)
    }
    return await this.cencoRepository.save(cenco)
  }
}
