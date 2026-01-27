import { Injectable, UseGuards } from '@nestjs/common';
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

  async obtenerMenus() {
    const menus = await this.menuRepository.query('select * from db_fmc.modulo where tipo_modulo_id = $1', [1]);
    return menus;
  }

  // Accesos disponibles
  async obtenerSubmenus() {
    const submenus = await this.menuRepository.query('select * from db_fmc.modulo where tipo_modulo_id = $1', [2]);
    return submenus;
  }

  async obtenerSubmenusPorPerfil(perfilId: number) {
    const submenuPerfil = await this.menuRepository.query(`
      select mp.perfil_id, m.modulo_id, m.nombre_modulo, m.modulo_padre_id, m.tipo_modulo_id 
      from db_fmc.modulo_has_perfil as mp
      join db_fmc.modulo as m on m.modulo_id = mp.modulo_id
      where m.tipo_modulo_id = 2 and mp.perfil_id = $1`, [perfilId]);

    return submenuPerfil;
  }

  // Crear SP para agregar submenu para que no haya duplicacion de informacion
  async agregarSubmenus(listaSubmenus: [], perfilId: number) {
    listaSubmenus.forEach(async submenu => {
      await this.menuRepository.query('INSERT INTO db_fmc.modulo_has_perfil (modulo_id, perfil_id) VALUES ($1, $2)', [submenu, perfilId]);
    });

    return {
      mensaje: 'Menus agregados a perfil correctamente'
    }
  }
}

