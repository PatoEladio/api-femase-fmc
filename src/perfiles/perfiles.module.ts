import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from './perfil.entity';
import { PerfilesService } from './perfiles.service';
import { PerfilesController } from './perfiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])],
  providers: [PerfilesService],
  exports: [PerfilesService, TypeOrmModule],
  controllers: [PerfilesController]
})
export class PerfilesModule { }
