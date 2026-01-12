export interface MenuTransformado {
  modulo_id: number;
  nombre_menu: string;
  submenus: Array<{
    modulo_id: number;
    nombre_modulo: string;
  }>;
}

