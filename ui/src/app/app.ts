import { Component } from '@angular/core';
import { FooterWidget } from '@widgets/footer/footer.widget';
import { HeaderWidget } from '@widgets/header/header.widget';
import { RouterOutlet } from '@angular/router';
import { ToastWidget } from '@widgets/toast/toast.widget';
import { QuestionWidget } from '@widgets/question/question.widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderWidget, FooterWidget, ToastWidget, QuestionWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
