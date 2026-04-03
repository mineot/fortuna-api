import { Component } from '@angular/core';
import { FooterWidget } from '@widgets/footer/footer.widget';
import { HeaderWidget } from '@widgets/header/header.widget';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderWidget, FooterWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
