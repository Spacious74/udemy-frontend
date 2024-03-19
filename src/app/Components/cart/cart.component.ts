import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  public course : any[] = [
    {
      title: 'JavaScript Essentials',
      category: 'Programming Languages',
      language: 'English',
      level: 'Beginner',
      price: 49.99,
      educator: {
        edId: '60f6f00ab88ccf001c26e631', // Example educator ID
        edname: 'Sophia Johnson',
      },
      coursePoster: {
        public_id: '234dfg567', // Example public ID
        url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D',
      },
    },
    {
      title: 'Python Programming for Beginners',
      category: 'Programming Languages',
      language: 'English',
      level: 'Beginner',
      price: 54.99,
      educator: {
        edId: '60f6f00ab88ccf001c26e632', // Example educator ID
        edname: 'Michael Johnson',
      },
      coursePoster: {
        public_id: '890vbn123', // Example public ID
        url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D',
      },
    },
    {
      title: 'Java Programming Masterclass',
      category: 'Programming Languages',
      language: 'English',
      level: 'Intermediate',
      price: 69.99,
      educator: {
        edId: '60f6f00ab88ccf001c26e633', // Example educator ID
        edname: 'Oliver Johnson',
      },
      coursePoster: {
        public_id: '567ghj890', // Example public ID
        url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D',
      },
    },
  ];

}
