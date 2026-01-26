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
import { Empresas } from './empresas/empresas.entity';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [User, Perfil, Estado, Menu, Empresas, Departamento, Cenco, TipoDispositivo, Dispositivo, Cargo]
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
    TurnoModule
  ],
  providers: [PerfilesService],
  controllers: [PerfilesController],
})
export class AppModule { }
