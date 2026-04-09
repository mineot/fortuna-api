import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FooterWidgetService } from '@widgets/footer/footer.widget.service';
import { HeaderWidgetService } from '@widgets/header/header.widget.service';
import { LanguageService } from '@i18n/language.service';
import { QuestionResponse, QuestionWidgetService } from '@widgets/question/question.widget.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastWidgetService } from '@widgets/toast/toast.widget.service';
import { TypesPageService } from './types.page.service';

@Component({
  selector: 'p-types',
  imports: [RouterLink],
  templateUrl: './types.page.html',
  styleUrl: './types.page.scss',
})
export class TypesPage implements OnInit, OnDestroy {
  private readonly $subscriptions: Subscription[] = [];

  readonly searchGroup = signal<string | null>(null);
  readonly searchName = signal<string | null>(null);

  constructor(
    public readonly footer: FooterWidgetService,
    public readonly header: HeaderWidgetService,
    public readonly i18n: LanguageService,
    public readonly question: QuestionWidgetService,
    public readonly router: Router,
    public readonly service: TypesPageService,
    public readonly toast: ToastWidgetService,
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

    this.$subscriptions.push(
      this.question.response.subscribe(({ response, details }: QuestionResponse) => {
        if (response === 'yes' && details) {
          const id = details.find((d) => d.key === 'id')?.value;

          if (id) {
            this.service.delete(Number(id)).then(() => {
              this.toast.show({
                variant: 'success',
                message: this.i18n.t('registers.types.success_delete'),
              });
            });
          }
        }
      }),
    );

    this.service.listAll();
  }

  ngOnDestroy(): void {
    this.footer.reset();
    this.$subscriptions.forEach((s) => s.unsubscribe());
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

  onDelete(id: number | undefined) {
    this.question.show({
      title: 'Voce tem certeza?',
      message: 'Voce realmente deseja excluir esse tipo?',
      details: [{ key: 'id', value: id }],
    });
  }
}
