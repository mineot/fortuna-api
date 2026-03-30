import { Component } from '@angular/core';
import { Menu } from '@widgets/navbar/menu/menu';
import { MenuService } from '@shared/menu.service';

@Component({
  imports: [Menu],
  selector: 'w-navbar',
  standalone: true,
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(public readonly menu: MenuService) {}
}
