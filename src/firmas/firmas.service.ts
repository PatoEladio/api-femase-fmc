import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFirmaDto } from './dto/create-firma.dto';
import { UpdateFirmaDto } from './dto/update-firma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Firma } from './entities/firma.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { NotFoundError } from 'rxjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class FirmasService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmaRepository: Repository<Firma>,
    private readonly mailerService: MailerService,
  ) { }

  async create(createFirmaDto: CreateFirmaDto) {
    const firma = this.firmaRepository.create({
      nombre: createFirmaDto.nombre,
      tipo: createFirmaDto.tipo,
      texto: createFirmaDto.texto,
      estado: "P",
      empresa: { empresa_id: createFirmaDto.empresa },
      empleado: { empleado_id: createFirmaDto.id_empleado },
      ...(createFirmaDto.usuario && { usuario: { usuario_id: createFirmaDto.usuario } })
    });
    const empleado = await this.firmaRepository.manager.findOne(Empleado, {
      where: { empleado_id: createFirmaDto.id_empleado }
    });
    if (!empleado) {
      throw new NotFoundException("Empleado no encontrado");
    }

    try {
      await this.mailerService.sendMail({
        to: empleado.email_laboral,
        subject: "Nueva Solicitud de firma",
        html: `<p>Se ha creado una nueva solicitud de firma</p>      
      <p>Favor de revisar la solicitud en tu portal para aprobar o rechazar la solicitud</p>
      <p> LINK DE LA PAGINA </p>`

      });
    } catch (error) {
      console.error("Error enviando email:", error.message);
    }
    return await this.firmaRepository.save(firma);
  }

  async findAll(empresa_id: number, usuario_id: number) {
    const usuario = await this.firmaRepository.manager.findOne(User, {
      where: { usuario_id: usuario_id },
      relations: ['empleado']
    });

    if (!usuario || !usuario.empleado) {
      throw new NotFoundException("Usuario o empleado asociado no encontrado");
    }

    return await this.firmaRepository.find({
      where: {
        empresa: { empresa_id: empresa_id },
        empleado: { empleado_id: usuario.empleado.empleado_id }
      },
      order: {
        id: "DESC",
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} firma`;
  }

  async aprovarRechazarFirma(idFirma: number, updateFirmaDto: UpdateFirmaDto, usuario_id: number, pin: number) {
    const firma = await this.firmaRepository.findOne({ 
      where: { id: idFirma },
      relations: ['usuario', 'empleado'] 
    });

    if (!firma) {
      throw new NotFoundException("Firma no encontrada");
    }

    const usuario = await this.firmaRepository.manager.findOne(User, {
      where: { usuario_id: usuario_id },
      relations: ['empleado']
    });

    if (!usuario || !usuario.empleado) {
      throw new NotFoundException("Usuario o empleado asociado no encontrado");
    }

    const empleado = usuario.empleado;
    const usuarioEmpleador = firma.usuario;
    
    if (empleado.pin_firma !== pin) {
      throw new NotFoundException("Pin incorrecto");
    }

    if(updateFirmaDto.estado === "A"){
      if (usuarioEmpleador && usuarioEmpleador.email) {
        await this.mailerService.sendMail({
          to: usuarioEmpleador.email,
          cc: [empleado.email],
          subject: "Firma aprobada",
          html: `<p>El empleado ${empleado.nombres + ' ' + empleado.apellido_paterno + ' ' + empleado.apellido_materno} ha aprobado la solicitud de firma</p>`
        });
      }
    }

    await this.firmaRepository.update(idFirma, {
      estado: updateFirmaDto.estado,
      motivo: updateFirmaDto.motivo
    });

    return await this.firmaRepository.findOneBy({ id: idFirma });
  }

  remove(id: number) {
    return `This action removes a #${id} firma`;
  }
}
