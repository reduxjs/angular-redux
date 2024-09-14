import { Injectable, OnDestroy } from '@angular/core';
import type { Action, Store, UnknownAction } from 'redux';
import { createSubscription } from './utils/Subscription';

@Injectable({ providedIn: null })
export class ReduxProvider<
  A extends Action<string> = UnknownAction,
  S = unknown,
> implements OnDestroy
{
  store!: Store<S, A>;
  subscription!: ReturnType<typeof createSubscription>;

  ngOnDestroy() {
    this.subscription.tryUnsubscribe();
    this.subscription.onStateChange = undefined;
  }
}

// TODO: Ideally this runs in the constructor, but DI doesn't allow us to pass items to the constructor?
export function createReduxProvider<
  A extends Action<string> = UnknownAction,
  S = unknown,
>(store: Store<S, A>) {
  const provider = new ReduxProvider<A, S>();
  provider.store = store;
  const subscription = createSubscription(store);
  provider.subscription = subscription;
  subscription.onStateChange = subscription.notifyNestedSubs;
  subscription.trySubscribe();

  return provider;
}
