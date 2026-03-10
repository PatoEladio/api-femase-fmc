import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository, In } from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cenco } from 'src/cencos/cenco.entity';
import { Semana } from 'src/semana/entities/semana.entity';
import { Horario } from 'src/horario/entities/horario.entity';
import { DetalleTurno } from 'src/detalle-turno/entities/detalle-turno.entity';


@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(Cenco)
    private cencoRepository: Repository<Cenco>,
    @InjectRepository(Semana)
    private semanaRepository: Repository<Semana>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(DetalleTurno)
    private detalleTurnoRepository: Repository<DetalleTurno>
  ) { }

  async create(createTurnoDto: Turno, usuario: string) {
    try {
      const nuevo = this.turnoRepository.create(createTurnoDto);
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
      relations: ['empresa', 'estado',],
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




  async asignarHorario(id_turno: number, id_dia: number[], id_horario: number[]) {
    if (id_dia.length !== id_horario.length) {
      throw new BadRequestException('La lista de días y la lista de horarios deben tener exactamente la misma cantidad de elementos.');
    }

    // PASO 2: Buscar que el Turno de verdad exista en la base de datos.
    const turno = await this.turnoRepository.findOne({
      where: { turno_id: id_turno }
    });

    if (!turno) {
      throw new NotFoundException('El Turno solicitado no existe.');
    }

    await this.detalleTurnoRepository.delete({ turno: { turno_id: id_turno } });

    if (id_dia.length === 0) {
      return {
        mensaje: 'Se han quitado todos los horarios de este turno.',
        turno_id: id_turno
      };
    }

    const dias = await this.semanaRepository.findBy({ cod_dia: In(id_dia) });
    const horarios = await this.horarioRepository.findBy({ horario_id: In(id_horario) });

    // PASO 6: Combinar los datos.
    // Recorremos la lista de Días uno por uno.
    const nuevosDetallesAGuardar = id_dia.map((id_del_dia, indice) => {

      // Obtenemos el ID del horario que está en la misma posición (índice) que este día. 
      const id_del_horario = id_horario[indice];

      // Buscamos la información completa del Día y del Horario en los datos que trajimos de la BD.
      const diaEncontrado = dias.find(d => d.cod_dia === id_del_dia);
      const horarioEncontrado = horarios.find(h => h.horario_id === id_del_horario);

      // Si nos pasaron un ID inventado que no está en la base de datos, lanzamos error.
      if (!diaEncontrado || !horarioEncontrado) {
        throw new NotFoundException(`No existe el día con ID ${id_del_dia} o el horario con ID ${id_del_horario} en la base de datos.`);
      }

      // Creamos la nueva fila para la tabla "detalle_turno" (conexión entre el Turno, el Día y el Horario).
      return this.detalleTurnoRepository.create({
        turno: turno,
        dia: diaEncontrado,
        horario: horarioEncontrado
      });
    });

    // PASO 7: Guardar todo en la base de datos al mismo tiempo.
    await this.detalleTurnoRepository.save(nuevosDetallesAGuardar);


    return {
      mensaje: 'Los horarios han sido asignados y actualizados correctamente en el turno.',
      turno_id: id_turno
    };
  }

  async obtenerHorarioPorTurno(id_turno: number) {
    // 1. Buscamos el turno para validar que exista y obtener su información básica.
    const turno = await this.turnoRepository.findOne({
      where: { turno_id: id_turno }
    });

    if (!turno) {
      throw new NotFoundException('El Turno solicitado no existe.');
    }

    // 2. Buscamos todas las relaciones en detalle_turno que pertenezcan a este turno.
    // Usamos 'relations' para que nos traiga los objetos completos de Dia y Horario.
    const detalles = await this.detalleTurnoRepository.find({
      where: { turno: { turno_id: id_turno } },
      relations: ["turno", 'dia', 'horario'],
      order: {
        dia: { cod_dia: 'ASC' } // Opcional: Ordenar por día de la semana
      }
    });
    return detalles
  }

}
