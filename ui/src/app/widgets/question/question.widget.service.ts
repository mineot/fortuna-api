import { Injectable, signal } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Subject } from 'rxjs';

export type ShowQuestion = {
  title: string;
  message: string;
  details: QuestionDetail[];
};

export type QuestionDetail = {
  key: string;
  value: string | number | undefined | null;
};

export type QuestionResponse = {
  response: 'yes' | 'no';
  details: QuestionDetail[];
};

@Injectable({
  providedIn: 'root',
})
export class QuestionWidgetService {
  readonly title = signal<string>('');
  readonly message = signal<string>('');
  readonly details = signal<QuestionDetail[]>([]);
  readonly modal = signal<bootstrap.Modal | null>(null);

  readonly response = new Subject<QuestionResponse>();

  show(params: ShowQuestion): void {
    this.title.set(params.title);
    this.message.set(params.message);
    this.details.set(params.details);
    this.modal()?.toggle();
  }

  confirm() {
    this.response.next({ response: 'yes', details: this.details() });
    this.title.set('');
    this.message.set('');
    this.details.set([]);
    this.modal()?.hide();
  }

  close() {
    this.title.set('');
    this.message.set('');
    this.modal()?.hide();
    this.response.next({ response: 'no', details: [] });
  }
}
