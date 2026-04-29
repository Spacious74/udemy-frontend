import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-que-ans',
  standalone: true,
  imports: [FormsModule, ButtonModule,CommonModule, InputTextModule],
  templateUrl: './que-ans.component.html',
  styleUrl: './que-ans.component.css',
})
export class QueAnsComponent {
  public queText : string;
  public que: any[] = [
    {
      question: 'Is there any alternative of figma ?',
      lectNo: 12,
      username: 'Natasha Romanoff',
      ansArr: [
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        }
      ],
    },
    {
      question: 'Is there any alternative of figma ?',
      lectNo: 12,
      username: 'Client Barton',
      ansArr: [
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        }
      ],
    },
    {
      question: 'Is there any alternative of figma ?',
      lectNo: 12,
      username: 'Wanda Maximoff',
      ansArr: [
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        }
      ],
    },
    {
      question: 'Is there any alternative of figma ?',
      lectNo: 12,
      username: 'Steve Rogers',
      ansArr: [
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        }
      ],
    },
    {
      question: 'Is there any alternative of figma ?',
      lectNo: 12,
      username: 'John Jacob',
      ansArr: [
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        },
        {
          username : "Steve jobs",
          answer : "Yes, there is many alternatives of figma for free."
        }
      ],
    },
  ];
}
