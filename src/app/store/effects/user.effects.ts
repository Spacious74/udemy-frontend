import { Injectable, OnInit, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { userInfoActions } from '../actions/userInfo.action';

@Injectable()
export class UserInfoEffects implements OnInit {

    private token: string;
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private cookieService: CookieService
    ) { }

    ngOnInit(): void {
        this.token = this.cookieService.get('skillUpToken');
    }

    loadUserInfo$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(userInfoActions.loadUser),
            exhaustMap(() => this.authService.getUserData()
                .pipe(
                    map(userInfo => (userInfoActions.loadUserSuccess({payload : userInfo.data}))),
                    catchError(() => of(userInfoActions.loadUserFailure()))
                ))
        );
    });
    
}