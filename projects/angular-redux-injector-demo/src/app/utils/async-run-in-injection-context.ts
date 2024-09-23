import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

export const asyncRunInInjectionContext = <TReturn>(
  injector: EnvironmentInjector,
  fn: () => Promise<TReturn>,
) => {
  return new Promise<TReturn>((resolve, reject) => {
    runInInjectionContext(injector, () => {
      fn()
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export type RunInInjectionContextProps<
  T extends object,
> = T & {
  injector: EnvironmentInjector;
};
