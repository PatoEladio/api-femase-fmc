import { Module } from '@nestjs/common';
import { CencosService } from './cencos.service';
import { CencosController } from './cencos.controller';

@Module({
  imports: [],
  providers: [CencosService],
  controllers: [CencosController]
})
export class CencosModule {}
