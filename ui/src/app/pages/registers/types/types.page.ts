import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { Router } from '@angular/router';
import { TypesPageService } from './types.page.service';

@Component({
  selector: 'p-types',
  imports: [],
  templateUrl: './types.page.html',
  styleUrl: './types.page.scss',
})
export class TypesPage implements OnInit, OnDestroy {
  readonly searchGroup = signal<string | null>(null);
  readonly searchName = signal<string | null>(null);

  constructor(
    public readonly service: TypesPageService,
    public readonly i18n: LanguageService,
    public readonly header: HeaderWidgetService,
    public readonly footer: FooterWidgetService,
    public readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.header.title.set(this.i18n.t('registers.types.title'));

    this.footer.setButtons([
      {
        id: 'new-type',
        type: 'button',
        variant: 'primary',
        label: this.i18n.t('registers.types.create'),
        click: () => this.router.navigate(['/registers/types/create']),
      },
    ]);

    this.service.listAll();
  }

  ngOnDestroy(): void {
    this.footer.reset();
  }

  onSearch() {
    this.service.listAll({
      group: this.searchGroup() ? Number(this.searchGroup()) : undefined,
      name: this.searchName() ?? undefined,
    });
  }

  onSearchClear() {
    this.searchGroup.set(null);
    this.searchName.set(null);
    this.onSearch();
  }
}
