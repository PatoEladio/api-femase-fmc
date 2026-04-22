import { Injectable } from '@nestjs/common';
import { CreateDetalleTurnoDto } from './dto/create-detalle-turno.dto';
import { UpdateDetalleTurnoDto } from './dto/update-detalle-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleTurno } from './entities/detalle-turno.entity';
import { Repository } from 'typeorm';
import { AuditoriaTurno } from './entities/auditoria-turno.entity';
import { Horario } from 'src/horario/entities/horario.entity';

@Injectable()
export class DetalleTurnoService {

  constructor(
    @InjectRepository(DetalleTurno)
    private readonly detalleTurnoRepository: Repository<DetalleTurno>,
    @InjectRepository(AuditoriaTurno)
    private readonly auditoriaTurnoRepository: Repository<AuditoriaTurno>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ) { }

  async create(createDetalleTurnoDto: any, solicitador: string) {
    const nuevoDetalleTurno = this.detalleTurnoRepository.create(createDetalleTurnoDto);
    const guardado = await this.detalleTurnoRepository.save(nuevoDetalleTurno);

    // Auditoria
    const horarioData = createDetalleTurnoDto;
    const horarioId = horarioData.id_horario || horarioData.horario_id || horarioData.horario;

    let horaEntrada = '';
    let horaSalida = '';

    if (horarioId) {
      const id = typeof horarioId === 'object' ? (horarioId.horario_id || horarioId.id) : horarioId;
      const h = await this.horarioRepository.findOneBy({ horario_id: id });
      if (h) {
        horaEntrada = h.hora_entrada;
        horaSalida = h.hora_salida;
      }
    }

    // const auditoria = this.auditoriaTurnoRepository.create({
    //   hora_entrada: horaEntrada,
    //   hora_salida: horaSalida,
    //   extension_turno: 'Diario',
    //   extension_nuevo_turno: 'Diario',
    //   inicio_turno: new Date(),
    //   solicitador_cambio: solicitador,
    //   observaciones: '',
    //   // También poblamos los campos 'nuevo' en la creación ya que es el primer estado
    //   nuevo_hora_entrada: horaEntrada,
    //   nuevo_hora_salida: horaSalida,
    // });
    // await this.auditoriaTurnoRepository.save(auditoria);

    return guardado;
  }

  findAll() {
    return `This action returns all detalleTurno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleTurno`;
  }

  async update(id: number, updateDetalleTurnoDto: any, solicitador: string) {
    const existe = await this.detalleTurnoRepository.findOne({
      where: { id_detalle_turno: id },
      relations: ['horario']
    });

    if (!existe) return null;

    // Valores antiguos
    const horaEntradaAnt = existe.horario?.hora_entrada || '';
    const horaSalidaAnt = existe.horario?.hora_salida || '';

    // Actualizar registro
    await this.detalleTurnoRepository.update(id, updateDetalleTurnoDto);

    // Valores nuevos
    const horarioData = updateDetalleTurnoDto;
    const nuevoHorarioId = horarioData.id_horario || horarioData.horario_id || horarioData.horario;

    let horaEntradaNuev = horaEntradaAnt;
    let horaSalidaNuev = horaSalidaAnt;

    if (nuevoHorarioId) {
      const nid = typeof nuevoHorarioId === 'object' ? (nuevoHorarioId.horario_id || nuevoHorarioId.id) : nuevoHorarioId;
      const h = await this.horarioRepository.findOneBy({ horario_id: nid });
      if (h) {
        horaEntradaNuev = h.hora_entrada;
        horaSalidaNuev = h.hora_salida;
      }
    }

    const auditoria = this.auditoriaTurnoRepository.create({
      hora_entrada: horaEntradaAnt,
      hora_salida: horaSalidaAnt,
      nuevo_hora_entrada: horaEntradaNuev,
      nuevo_hora_salida: horaSalidaNuev,
      extension_nuevo_turno: 'Diario',
      inicio_turno: new Date(),
      solicitador_cambio: solicitador,
      observaciones: '',
    });
    await this.auditoriaTurnoRepository.save(auditoria);

    return this.detalleTurnoRepository.findOne({
      where: { id_detalle_turno: id },
      relations: ['horario']
    });
  }

  remove(id: number) {
    return `This action removes a #${id} detalleTurno`;
  }
}
