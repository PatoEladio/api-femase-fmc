import { ConflictException, HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menus.entity';
import { Repository } from 'typeorm';
import { MenuTransformado } from './interfaces/menuTransformado.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
@UseGuards(AuthGuard)
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>
  ) { }

  private transformarModulos(modulos: Menu[]) {
    const modulosMap = new Map<number, MenuTransformado>();

    modulos.forEach(modulo => {
      modulosMap.set(modulo.modulo_id, {
        modulo_id: modulo.modulo_id,
        nombre_menu: modulo.nombre_modulo,
        submenus: []
      });
    });

    const resultado: MenuTransformado[] = [];

    modulos.forEach(modulo => {
      const moduloTransformado = modulosMap.get(modulo.modulo_id);

      // Es modulo padre
      if (modulo.modulo_padre_id === null) {
        if (moduloTransformado) {
          resultado.push(moduloTransformado);
        }
      } else {
        const padre = modulosMap.get(modulo.modulo_padre_id);
        if (padre && moduloTransformado) {
          padre.submenus.push({
            modulo_id: modulo.modulo_id,
            nombre_modulo: modulo.nombre_modulo
          });
        }
      }
    });

    const listadoFinal: MenuTransformado[] = [];

    resultado.forEach(modulo => {
      if (modulo.submenus.length != 0) {
        listadoFinal.push(modulo);
      }
    })

    return listadoFinal;
  }

  async obtenerMenusPorPerfil(perfilId: number) {
    const respuesta: Menu[] = await this.menuRepository.query(
      'SELECT * FROM db_fmc.obtener_modulos_perfil($1)',
      [perfilId]
    );

    const menuTransformado = this.transformarModulos(respuesta);
    return menuTransformado;
  }

  // Para agregar a perfiles
  async obtenerMenus() {
    const menus = await this.menuRepository.find();
    const menusTransformados = this.transformarModulos(menus)
    return menusTransformados;
  }
}

