// Add a prefix delimited with "." to all properties in T
type PrependKey<K extends PropertyKey, T> = {
  [P in Exclude<keyof T, symbol> as `${Exclude<K, symbol>}.${P}`]: T[P];
};

// Recursively flatten all the properties of T so each property have the full "path" separated by "."
export type FlattenProperties<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? (x: PrependKey<K, FlattenProperties<T[K]>> & PrependKey<K, T[K]>) => void
    : (
        x: {
          [P in Exclude<keyof T, symbol>]: T[P];
        },
      ) => void;
}[keyof T] extends (x: infer I) => void
  ? { [K in keyof I]: I[K] }
  : never;

// Replace the type of one field with another type
export type Replace<T, K extends keyof T, N> = Omit<T, K> & { [P in K]: N };

// Filter function to check if an item is not null/undefined, and uses a type guard to tell TypeScript that it is set
// someList.map(...).filter(notEmpty) - TypeScript will now say that elements in this list can't be null/undefined
export function notEmpty<T>(item: T | undefined | null): item is T {
  return item !== null && item !== undefined;
}
