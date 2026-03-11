import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Perfil } from './perfiles/perfil.entity';
import { Estado } from './estado/estado.entity';
import { MenusModule } from './menus/menus.module';
import { Menu } from './menus/menus.entity';
import { PerfilesService } from './perfiles/perfiles.service';
import { PerfilesController } from './perfiles/perfiles.controller';
import { PerfilesModule } from './perfiles/perfiles.module';
import { EmpresasModule } from './empresas/empresas.module';
import { Empresa } from './empresas/empresas.entity';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { Departamento } from './departamentos/departamento.entity';
import { CencosModule } from './cencos/cencos.module';
import { Cenco } from './cencos/cenco.entity';
import { DispositivoModule } from './dispositivo/dispositivo.module';
import { TipoDispositivoModule } from './tipo-dispositivo/tipo-dispositivo.module';
import { TipoDispositivo } from './tipo-dispositivo/entities/tipo-dispositivo.entity';
import { Dispositivo } from './dispositivo/entities/dispositivo.entity';
import { CargosModule } from './cargos/cargos.module';
import { Cargo } from './cargos/entities/cargo.entity';
import { TurnoModule } from './turno/turno.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { HorarioModule } from './horario/horario.module';
import { Horario } from './horario/entities/horario.entity';
import { Turno } from './turno/entities/turno.entity';
import { EmpleadoModule } from './empleado/empleado.module';
import { Empleado } from './empleado/entities/empleado.entity';
import { AfpModule } from './afp/afp.module';
import { Afp } from './afp/entities/afp.entity';
import { ErrorRechazoModule } from './error-rechazo/error-rechazo.module';
import { ErrorRechazo } from './error-rechazo/entities/error-rechazo.entity';
import { ProveedorCorreoModule } from './proveedor-correo/proveedor-correo.module';
import { ProveedorCorreo } from './proveedor-correo/entities/proveedor-correo.entity';
import { FeriadosModule } from './feriados/feriados.module';
import { Feriado } from './feriados/entities/feriado.entity';
import { TipoAusenciaModule } from './tipo-ausencia/tipo-ausencia.module';
import { TipoAusencia } from './tipo-ausencia/entities/tipo-ausencia.entity';
import { SesionActivaModule } from './sesion-activa/sesion-activa.module';
import { SesionActiva } from './sesion-activa/entities/sesion-activa.entity';
import { DetalleTurnoModule } from './detalle-turno/detalle-turno.module';
import { SemanaModule } from './semana/semana.module';
import { DetalleTurno } from './detalle-turno/entities/detalle-turno.entity';
import { Semana } from './semana/entities/semana.entity';
import { TipoMarcasModule } from './tipo-marcas/tipo-marcas.module';
import { TipoMarca } from './tipo-marcas/entities/tipo-marca.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'superadmin',
      database: 'femase',
      synchronize: false,
      entities: [User, Perfil, Estado, Menu, Empresa, Departamento, Cenco, TipoDispositivo, Dispositivo, Cargo, Horario, Turno, Empleado, Afp, ErrorRechazo, ProveedorCorreo, Feriado, TipoAusencia, SesionActiva, DetalleTurno, Semana, TipoMarca]
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'soportefemasetest@gmail.com',
          pass: 'mskobvyknfujvshj'
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      defaults: {
        from: '"Soporte FEMASE" <soportefemasetest@gmail.com>'
      }
    }),
    AuthModule,
    UsersModule,
    MenusModule,
    PerfilesModule,
    EmpresasModule,
    DepartamentosModule,
    CencosModule,
    DispositivoModule,
    TipoDispositivoModule,
    CargosModule,
    TurnoModule,
    HorarioModule,
    EmpleadoModule,
    AfpModule,
    ErrorRechazoModule,
    ProveedorCorreoModule,
    FeriadosModule,
    TipoAusenciaModule,
    SesionActivaModule,
    DetalleTurnoModule,
    SemanaModule,
    TipoMarcasModule
  ],
  providers: [PerfilesService],
  controllers: [PerfilesController],
})
export class AppModule { }
