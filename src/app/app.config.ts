import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HttpClientXsrfModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { cartReducer } from './store/reducers/cart.reducer';
import { userInfoReducer } from './store/reducers/user.reducer';
import { UserInfoEffects } from './store/effects/user.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideStore({
      cart : cartReducer,
      userInfo : userInfoReducer
    }),
    provideEffects(UserInfoEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};
