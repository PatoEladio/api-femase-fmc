import { Module } from '@nestjs/common';
import { SemanaService } from './semana.service';
import { SemanaController } from './semana.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semana } from './entities/semana.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semana])],
  controllers: [SemanaController],
  providers: [SemanaService],
})
export class SemanaModule {}
