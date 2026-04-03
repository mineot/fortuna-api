import { Component } from '@angular/core';
import { FooterWidgetService } from './footer.widget.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '@i18n/language.service';

@Component({
  selector: 'w-footer',
  imports: [ReactiveFormsModule],
  templateUrl: './footer.widget.html',
  styleUrl: './footer.widget.scss',
})
export class FooterWidget {
  searchForm = new FormGroup({
    search: new FormControl(''),
  });

  constructor(
    public readonly service: FooterWidgetService,
    public readonly i18n: LanguageService,
  ) {}

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value === '') {
      this.service.searchSubject.next(null);
    }
  }

  onSubmit() {
    this.service.searchSubject.next(this.searchForm.value.search);
  }
}
