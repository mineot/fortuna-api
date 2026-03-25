import { Component } from '@angular/core';
import { Menu } from '@widgets/navbar/menu/menu';

@Component({
  imports: [Menu],
  selector: 'w-navbar',
  standalone: true,
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {}
