import { Module } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AfpController } from './afp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Afp } from './entities/afp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Afp])],
  controllers: [AfpController],
  providers: [AfpService],
})
export class AfpModule { }
