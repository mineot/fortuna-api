import { Component } from '@angular/core';
import { Menu } from '@widgets/navbar/menu/menu';
import { MenuService } from '@shared/menu.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [Menu, RouterLink],
  selector: 'w-navbar',
  standalone: true,
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(public readonly menu: MenuService) {}
}
