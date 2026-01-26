import { BadRequestException, Body, ConflictException, HttpException, Injectable, InternalServerErrorException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService
  ) { }

  async searchActiveUser(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        username,
        estado: {
          estado_id: 1
        }
      },
      relations: [
        'perfil',
        'estado',
        'empresa'
      ],
    });
  }
  // IDEA NUEVA DEJAR LOS EMPLEADOS CON SU RESPECTIVA EMPRESA EN LA MISMA TABLA Y SI EL PERFIL DE USUARIO QUE INGRESA ES SUPERADMIN ENVIAR TODAS LAS EMPRESAS
  async buscarTodosLosUsuarios(): Promise<User[]> {
    const busqueda = this.usersRepository.find({
      relations: [
        'perfil',
        'estado',
        'empresa'
      ]
    });

    if ((await busqueda).length > 0) {
      return busqueda;
    } else {
      throw new HttpException('No se encontraron usuarios', 400)
    }
  }

  async buscarUsuarioPorId(usuarioId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        usuario_id: usuarioId
      },
      relations: [
        'estado',
        'perfil',
        'empresa'
      ]
    });
  }

  async crearUsuario(usuario: User): Promise<any> {
    return 'a';
  }

  async recuperarClave(run: string) {
    const usuario = await this.usersRepository.findOne({
      where: { run_usuario: run, estado: { estado_id: 1 } }
    });

    if (!usuario) throw new HttpException('Usuario no encontrado', 404);

    const codigoAleatorio = Math.floor(100000 + Math.random() * 900000).toString();
    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

    usuario.reset_token = codigoAleatorio; // Idealmente usa bcrypt aquí
    usuario.reset_token_expires = fechaExpiracion;
    await this.usersRepository.save(usuario);

    try {
      await this.mailerService.sendMail({
        to: usuario.email,
        subject: 'Recuperación de Clave',
        template: './recuperacion', // Si usas templates
        context: { nombre: usuario.nombres, codigo: codigoAleatorio },
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola, ${usuario.nombres}</h2>
        <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
        <h1 style="color: #007bff; letter-spacing: 5px;">${codigoAleatorio}</h1>
        <p>Este código expirará en 15 minutos.</p>
        <p>Si no solicitaste esto, puedes ignorar este correo.</p>
        </div>`,
      });
      return { message: 'Código enviado al correo registrado' };
    } catch (error) {
      throw new HttpException('Error al enviar el correo', 500);
    }
  }

  async actualizarClave(run: string, codigo: string, nuevaClave: string) {
    const usuario = await this.usersRepository.findOne({
      where: { run_usuario: run, estado: { estado_id: 1 } }
    });

    if (!usuario) throw new HttpException('Usuario no encontrado', 404);

    if (!usuario.reset_token || usuario.reset_token !== codigo) {
      throw new HttpException('El código es incorrecto', 400);
    }

    const ahora = new Date();

    if (!usuario.reset_token_expires || ahora > usuario.reset_token_expires) {
      throw new HttpException('El código ha expirado o es inválido', 400);
    }

    const salt = await bcrypt.genSalt();
    usuario.password = await bcrypt.hash(nuevaClave, salt);

    usuario.reset_token = null;
    usuario.reset_token_expires = null;

    await this.usersRepository.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }
}