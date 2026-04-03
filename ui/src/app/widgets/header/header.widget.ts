import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarWidget } from '@app/widgets/sidebar/sidebar.widget';
import { HeaderWidgetService } from './header.widget.service';

@Component({
  selector: 'w-header',
  imports: [RouterLink, SidebarWidget],
  templateUrl: './header.widget.html',
  styleUrl: './header.widget.scss',
})
export class HeaderWidget {
  constructor(readonly service: HeaderWidgetService) {}
}
