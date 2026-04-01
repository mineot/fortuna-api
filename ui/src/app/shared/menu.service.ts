import { Injectable } from '@angular/core';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';
import { CONFIGS_MENU } from './menus/configs.menu';
import { ADDS_MENU } from './menus/adds.menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly menuItems: MenuConfiguration[] = [ADDS_MENU, CONFIGS_MENU];
}
