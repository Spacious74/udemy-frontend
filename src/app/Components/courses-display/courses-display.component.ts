import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { data } from '../../data/course';
import { DataViewModule } from 'primeng/dataview';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-courses-display',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SelectButtonModule, RadioButtonModule, DataViewModule ],
  templateUrl: './courses-display.component.html',
  styleUrl: './courses-display.component.css',
})
export class CoursesDisplayComponent {

  public courses : any[] = data;
  price!: string;
  lang!: string;
  level! : string;
  clearFilter(type : string){
    switch(type){
      case 'price' : 
        this.price = '';
        return;
      case 'lang' :
        this.lang = '';
        return;
      case 'level' :
        this.level = '';
        return;
      default : 
        this.price = ''; this.level = ''; this.lang=''; return;
    }
  }
  priceOption: any[] = [
    { name: 'Paid', value: "paid" },
    { name: 'Free', value: "free" },
  ];
  language: any[] = [
    { name: 'Hindi', value: "Hindi" },
    { name: 'English', value: "English" },
  ];
}
