/* @macrome
 * @generatedby @macrome/generator-typescript
 * @generatedfrom ./api.ts#1647109390474
 * This file is autogenerated. Please do not edit it directly.
 * When editing run `npx macrome watch` then change the file this is generated from.
 */
import { Pattern } from '../types';

type Generate<I> = (pattern: Pattern, iterable: I) => AsyncIterableIterator<Array<string | null>>;

declare const _: unique symbol;

export declare class AsyncApi<I> {
  private [_];

  constructor(generate: Generate<I>);
}
