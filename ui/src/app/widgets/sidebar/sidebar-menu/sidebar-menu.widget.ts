import { Component, Input } from '@angular/core';
import { SidebarMenuItem } from '../sidebar-menu-item/sidebar-menu-item.widget';
import type { Item } from '../sidebar-menu-item/sidebar-menu-item.widget';

export type Menu = {
  id: number;
  label: string;
  items: Item[];
};

@Component({
  selector: 'w-sidebar-menu',
  imports: [SidebarMenuItem],
  templateUrl: './sidebar-menu.widget.html',
  styleUrl: './sidebar-menu.widget.scss',
})
export class SidebarMenu {
  @Input('menu') menu: Menu = { id: 0, label: 'Menu', items: [] };
}
