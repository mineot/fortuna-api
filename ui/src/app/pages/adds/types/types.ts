import { Component, OnInit } from '@angular/core';
import { PageService } from '@app/shared/page.service';

@Component({
  selector: 'p-types',
  imports: [],
  templateUrl: './types.html',
  styleUrl: './types.scss',
})
export class Types implements OnInit {
  constructor(public readonly page: PageService) {}

  async ngOnInit() {
    this.page.i18nTitle.set('adds.types.title');
    // const items = await window.electronApi?.app?.types?.listAll();
    // console.log(items);
  }
}
