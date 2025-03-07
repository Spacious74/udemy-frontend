import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../Services/auth.service';
import { userInfoActions } from '../actions/userInfo.action';

@Injectable()
export class UserInfoEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthService,
    ) { }


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