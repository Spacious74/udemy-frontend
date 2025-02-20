import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserList } from '../models/UserList';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<any>(null); // Replace 'any' with your user model
  user$: Observable<UserList> = this.userSubject.asObservable();

  constructor() {}

  // Method to fetch user data from an API and update state
  setUser(user: UserList) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.getValue();
  }

}
