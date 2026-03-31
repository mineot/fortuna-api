import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { Navbar } from '@widgets/navbar/navbar';

@Component({
  selector: 'w-page',
  imports: [Navbar],
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class Page {
  constructor(public readonly i18n: LanguageService) {}
}
