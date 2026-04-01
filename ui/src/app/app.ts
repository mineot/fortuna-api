import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Page } from '@widgets/page/page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Page],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
