import { Component, OnInit } from '@angular/core';
import { PageService } from '@app/shared/page.service';
import { TypesService } from './types.service';

@Component({
  selector: 'p-types',
  imports: [],
  templateUrl: './types.html',
  styleUrl: './types.scss',
})
export class Types implements OnInit {
  constructor(
    public readonly page: PageService,
    public readonly service: TypesService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.page.i18nTitle.set('registers.types.title');
    this.service.listAll();
  }
}
