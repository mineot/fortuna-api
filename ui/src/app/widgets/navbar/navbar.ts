import { Component, Input } from '@angular/core';
import { Menu } from '@widgets/navbar/menu/menu';
import { MenuConfiguration } from './navbar.types';

@Component({
  imports: [Menu],
  selector: 'w-navbar',
  standalone: true,
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input('menu-items') menuItems: MenuConfiguration[] = [];
}
