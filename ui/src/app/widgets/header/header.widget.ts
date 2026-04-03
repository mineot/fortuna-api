import { Component } from '@angular/core';
import { HeaderWidgetService } from './header.widget.service';
import { SidebarWidget } from '@widgets/sidebar/sidebar.widget';

@Component({
  selector: 'w-header',
  imports: [SidebarWidget],
  templateUrl: './header.widget.html',
  styleUrl: './header.widget.scss',
})
export class HeaderWidget {
  constructor(public readonly service: HeaderWidgetService) {}
}
