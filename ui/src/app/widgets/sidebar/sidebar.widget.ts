import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';

@Component({
  selector: 'w-sidebar',
  imports: [],
  templateUrl: './sidebar.widget.html',
  styleUrl: './sidebar.widget.scss',
})
export class SidebarWidget {
  constructor(public readonly i18n: LanguageService) {}
}
