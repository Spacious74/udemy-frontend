import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TabViewModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  public username : string;
  public email : string;

}
