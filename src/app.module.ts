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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [User, Perfil, Estado, Menu, Empresas, Departamento, Cenco, TipoDispositivo]
    }),
    AuthModule,
    UsersModule,
    MenusModule,
    PerfilesModule,
    EmpresasModule,
    DepartamentosModule,
    CencosModule,
    DispositivoModule,
    TipoDispositivoModule
  ],
  providers: [PerfilesService],
  controllers: [PerfilesController],
})
export class AppModule {}
