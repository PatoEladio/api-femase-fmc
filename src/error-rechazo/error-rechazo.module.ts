import { Module } from '@nestjs/common';
import { ErrorRechazoService } from './error-rechazo.service';
import { ErrorRechazoController } from './error-rechazo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorRechazo } from './entities/error-rechazo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorRechazo])],
  controllers: [ErrorRechazoController],
  providers: [ErrorRechazoService],
})
export class ErrorRechazoModule {}
