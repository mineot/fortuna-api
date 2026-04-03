import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type Item = {
  id: number;
  routerLink: string;
  label: string;
};

@Component({
  selector: 'w-sidebar-menu-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-menu-item.widget.html',
  styleUrl: './sidebar-menu-item.widget.scss',
})
export class SidebarMenuItem {
  @Input('items') items: Item[] = [];
}
