import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Link } from '@widgets/link/link';
import { Button } from '@widgets/button/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Link, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
