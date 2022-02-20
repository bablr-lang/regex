/* @macrome
 * @generatedby @macrome/generator-typescript
 * @generatedfrom ./rbt.ts#1645382246906
 * This file is autogenerated. Please do not edit it directly.
 * When editing run `npx macrome watch` then change the file this is generated from.
 */
export type ImmutableTree<K, V> = {
  get(key: K): V;
  insert(key: K, value: V): ImmutableTree<K, V>;
  find(key: K): {
    value: V;
    update: (value: V) => ImmutableTree<K, V>;
  };
  readonly length: number;
};
export declare const createTree: <K, V>(comparator: (a: K, b: K) => number) => ImmutableTree<K, V>;