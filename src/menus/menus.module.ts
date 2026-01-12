import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Menu } from './menus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  providers: [MenusService],
  controllers: [MenusController]
})
export class MenusModule { }
