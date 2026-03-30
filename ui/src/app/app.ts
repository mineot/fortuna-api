import { Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { Navbar } from '@widgets/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(public readonly i18n: LanguageService) {}
}
