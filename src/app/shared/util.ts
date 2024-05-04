import { Observable, combineLatest as rxCombineLatest, map, shareReplay } from 'rxjs';

export function parseNumber(value: string | null | undefined) {
  switch (value) {
    case null:
    case undefined:
      return value;
    default:
      return +value;
  }
}

type ObjectOfObservables = { [key: string]: Observable<unknown> };
type MapToObservableElements<T extends ObjectOfObservables> = {
  [key in keyof T]: T[key] extends Observable<infer R> ? R : never;
};

export const cache = <T>() => shareReplay<T>({ bufferSize: 1, refCount: true });

export const combineLatest = <T extends ObjectOfObservables>(args: T) => {
  const entries = Object.entries(args);
  return rxCombineLatest(entries.map((entry) => entry[1])).pipe(
    map(
      (values) =>
        Object.fromEntries(
          entries.map((entry, i) => [entry[0], values[i]])
        ) as MapToObservableElements<T>
    )
  );
};

export function assertDefined<T>(item: T, ...propertyNames: (keyof T)[]): void {
  for (const propertyName of propertyNames) {
    if (item[propertyName] === undefined) {
      throw new Error(`${String(propertyName)} must be defined`);
    }
  }
}
