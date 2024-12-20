import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRedux } from '@reduxjs/angular-redux';
import { store } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRedux({ store }),
  ],
};
