import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RandomNumberService {
  getRandomNumber() {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 100));
      }, 1000);
    });
  }
}
