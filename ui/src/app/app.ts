import { Component } from '@angular/core';
import { FooterWidget } from '@app/widgets/footer/footer.widget';
import { HeaderWidget } from '@app/widgets/header/header.widget';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderWidget, FooterWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
