import { Injectable } from '@angular/core';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';
import { CONFIGS_MENU } from './menus/configs.menu';
import { REGISTERS_MENU } from './menus/registers.menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly menuItems: MenuConfiguration[] = [REGISTERS_MENU, CONFIGS_MENU];
}
