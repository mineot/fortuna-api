import { Component } from '@angular/core';
import { HeaderWidgetService } from './header.widget.service';
import { RouterLink } from '@angular/router';
import { SidebarWidget } from '@app/widgets/sidebar/sidebar.widget';

@Component({
  selector: 'w-header',
  imports: [RouterLink, SidebarWidget],
  templateUrl: './header.widget.html',
  styleUrl: './header.widget.scss',
})
export class HeaderWidget {
  constructor(public readonly service: HeaderWidgetService) {}
}
