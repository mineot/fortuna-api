import { Component, OnInit } from '@angular/core';
import { PageService } from '@shared/page.service';

@Component({
  selector: 'p-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  constructor(public readonly page: PageService) {}

  ngOnInit(): void {
    this.page.i18nTitle.set('home.title');
  }
}
