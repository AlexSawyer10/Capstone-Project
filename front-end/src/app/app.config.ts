import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-hce0b3drte4jy7h4.us.auth0.com',
      clientId: 'T0t0KdBNbCKou3tdn3APxD4b1623Pq28',
      authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email'
      }
    })
  ]
};
