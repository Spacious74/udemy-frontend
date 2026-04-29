import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../Services/auth.service';
import { userInfoActions } from '../actions/userInfo.action';

@Injectable()
export class UserInfoEffects {

    private actions$ = inject(Actions);
    private authService = inject(AuthService);

    loadUserInfo$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(userInfoActions.loadUser),
            exhaustMap(() => this.authService.getUserData().pipe(
                map(userInfo => (userInfoActions.loadUserSuccess({payload : userInfo.data}))),
                catchError(() => of(userInfoActions.loadUserFailure()))
            ))
        );
    });

}