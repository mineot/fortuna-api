import { AfterViewInit, Component } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { QuestionWidgetService } from './question.widget.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'w-question',
  imports: [],
  templateUrl: './question.widget.html',
  styleUrl: './question.widget.scss',
})
export class QuestionWidget implements AfterViewInit {
  constructor(
    public readonly i18n: LanguageService,
    public readonly service: QuestionWidgetService,
  ) {}

  ngAfterViewInit(): void {
    this.service.modal.set(
      new bootstrap.Modal('#appModal', {
        backdrop: 'static',
        keyboard: false,
      }),
    );
  }
}
