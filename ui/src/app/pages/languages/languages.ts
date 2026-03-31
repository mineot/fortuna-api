import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { Page } from '@widgets/page/page';

@Component({
  selector: 'p-languages',
  imports: [Page],
  templateUrl: './languages.html',
  styleUrl: './languages.scss',
})
export class Languages {
  constructor(public readonly i18n: LanguageService) {}
}
